# Primordial Soup leaderboard security review

Date: 2026-08-17
Scope: leaderboard/worker.js (Cloudflare Worker plus D1, not yet deployed), the boards client section of index.html, sw.js, and a repo wide scan for secrets. The review ran in two rounds: the first was read only on index.html because another agent was editing it at the time, the second applied fixes there once that agent finished.

## Summary

Eight real findings and ten confirmed safe checks. Two findings are high severity, three medium, three low, plus ten informational pass notes. Six findings are now fixed and verified: H1, H2, M1, M2, L2, and L3. Two remain open, M3 and L1, each for a reason explained in its own entry below (a design decision or a change too large to verify against the test plan on hand).

The single most important finding was H1. The "share your dish" feature in index.html embedded the leaderboard secret token in the seed string it explicitly invites players to copy and share, which defeated the token based ownership model the whole leaderboard depends on. It is now fixed.

## High severity

### H1. Dish seed sharing leaks the leaderboard auth token
Status: fixed
Location: index.html. saveWorld(), around line 2172 to 2179, includes dishToken in the saved state blob, left unchanged since the local save is meant to keep it. packSeed(), lines 2795 to 2805, used to encode that whole blob with deflate and base64url, no encryption involved. The btnShare click handler, lines 2818 to 2829, titles this "DISH SEED, COPY AND SHARE," copies it to the clipboard, and tells the player to paste it into import on any copy of the game. loadWorld(), around line 2231, sets dishToken = s.dishToken || makeToken(), so an imported blob with no token already regenerates a fresh one.
Attack scenario: a player uses the built in share button to send their dish seed to a friend, or posts it publicly, which the wording itself invites. Anyone who receives that string could decode it with plain base64 and deflate, no game required, and read out dishToken, the exact secret worker.js uses to decide who owns a dish. They could then POST to /submit with that dish id and token and overwrite the original player's leaderboard entries, or simply import the seed into their own copy of the game, which did the same thing automatically.
Fix applied: packSeed() now parses the saved JSON, deletes the dishToken field, and re-serializes it before either the deflate path or the plain fallback path encodes it. saveWorld() itself was not touched, so the local save on the player's own device still carries the token. loadWorld()'s existing dishToken = s.dishToken || makeToken() line was not touched either, it already covers an imported blob with no token.
Verified in the browser pane against a running copy of the page (served over local http rather than a bare file path, since a plain file preview here renders as a static, non scriptable snapshot): created a world, called saveWorld(), and confirmed dishToken was present in the localStorage save. Called packSeed(), then decoded the result with the page's own unpackSeed(), the same reverse path the import button uses. The decoded object had no dishToken key, the decoded text did not contain the token string anywhere, and neither did the raw encoded seed string. Then ran the exact sequence the seedLoad button handler runs (unpackSeed, JSON.parse, validate against GAME_V, store.set, loadWorld()) programmatically: loadWorld() returned true, and the resulting dishToken was a different, properly formed 32 character token from the one that had exported it.

### H2. No plausibility check on gen, peakPop, or dynasty scores
Status: fixed
Location: worker.js, scoreFor(), lines 39 to 55, and the age plausibility check in handleSubmit(), now lines 87 to 93.
Attack scenario: the only anti cheat check in the file compared stats.years against wall clock time since the dish was first seen. stats.gen, stats.peakPop, and stats.dynasty were only clamped to a numeric range with Math.min and Math.max, never checked against elapsed time. A brand new dish could submit stats such as gen 9999, peakPop 99999, dynasty 999, with years kept under the grace window, in one single request, and instantly rank first on the gen, dynasty, and daily boards (daily also scores from gen and peak). This directly contradicted the "cheat resistant by construction" claim in leaderboard/README.md, which in practice only described the age check.
Fix applied: three more checks now run right after the years check, all using the same elapsedYears value. gen over elapsedYears times 25 plus 30 is rejected with 422, roughly one generation per ten simulated seconds with a generous grace allowance. dynasty over elapsedYears plus 2 is rejected the same way. peakPop over a flat 2500 is rejected regardless of elapsed time, a hard physical ceiling. All three read their field the same way scoreFor() already does, bitwise or against zero, so a missing field never falsely trips the check.
Verified: node --check passed, and a fresh local run confirmed a modest submission (gen 3) still returns ok true, while a submission on a brand new dish claiming gen 9999 is rejected with 422 and the message "implausible generation; too many births for the time elapsed."

## Medium severity

### M1. Body size limit could be bypassed through Content-Length
Status: fixed
Location: worker.js, top of handleSubmit().
Attack scenario: the only size check was content length compared against MAX_BODY, read straight from the request header. A request that omits the Content-Length header, or sends a smaller value than the true body, would read as 0 and pass that check, after which the body was parsed with no limit actually enforced.
Fix applied: the body is now read as text first, its real length is checked against MAX_BODY, and only then is it parsed with JSON.parse. Verified with node --check, a fresh local D1 schema load, wrangler dev on port 8792, a passing /health check, and one valid /submit that returned ok true with the expected rank. The .wrangler directory created for the test was removed afterward.

### M2. No per IP or global protection against mass dish creation
Status: fixed
Location: worker.js, handleSubmit(), right after the dish ownership check. schema.sql, new ips table.
Attack scenario: the only rate limits were per dish, a 30 second cooldown between submits to the same dish and a 2000 submit lifetime cap, neither of which applied to a dish id that had never been used before. A script could mint a new random SOUP style id on every request and create unlimited rows with no CAPTCHA and no IP throttle. Two consequences stood out: this could exhaust Cloudflare D1's free tier daily write quota and break submissions for real players for the rest of the day, and it also worked as a yes or no oracle for whether a given dish id was already registered, since a 403 means yes and a success means no.
Fix applied: a new ips(iphash, day, submits, dishes) table, primary keyed on iphash and day. On every submit, the worker hashes CF-Connecting-IP (or the literal string "unknown" if that header is missing) with the existing sha256() helper, then runs one upsert with a RETURNING clause that increments submits every time and increments dishes only when the dish being submitted was not already registered. If the returned submits exceeds 300 or dishes exceeds 40 for that IP and day, the request is rejected with 429, before the 30 second per dish check and before any dish or entries write. This is a single extra query per submit.
Verified: node --check passed. In the local test run, two submits from the same test client produced exactly one ips row for that day with submits 2 and dishes 2, matching the two new dish ids used, including the one that was later rejected by the H2 plausibility check, which confirms the counter runs early enough to count abusive attempts, not only successful ones.

### M3. Stats blob has no server side allow list, and no client side escaping helper exists yet
Status: open
Location: worker.js, the statsJson handling in handleSubmit() around line 89, and the stats column returned by handleBoard(). index.html, renderBoards(), the innerHTML line around 3024.
Attack scenario: worker.js stores whatever JSON object the client sends as stats, only capping its length at 4000 characters, and echoes it back unchanged through GET /board. This review read index.html in full for this path and confirmed renderBoards() currently only inserts e.callsign and e.label into innerHTML, never e.stats, so there is no live cross site scripting today. callsign is locked down by a regex on the server and label is built purely from numbers, so both are safe as used right now. But the only pattern in the codebase for showing a board row is string concatenation straight into innerHTML with no escaping helper anywhere in the file. The moment a future feature renders any part of a leaderboard entry's stats, which is a very natural addition such as a details tooltip, it becomes stored cross site scripting, because any player's stats object can already carry attacker chosen strings today.
Smallest fix: on the server, only persist and echo a fixed, typed set of stats fields, namely years, gen, peakPop, dynasty, and dishTag, the same fields scoreFor() already reads, instead of the whole arbitrary object. On the client, if stats ever gets rendered, use textContent or a small escaping helper, never innerHTML, for any field that is not already guaranteed numeric server side.

## Low severity

### L1. First submit race on a brand new dish id
Status: open
Location: worker.js, handleSubmit(), the dishes upsert around lines 75 to 93, and the entries upsert around lines 108 to 117.
Attack scenario: the ownership check, reading the dishes row and comparing tokenhash, and the write that establishes ownership, an insert into dishes with an upsert, are two separate statements, not one atomic step from the application's point of view. The upsert itself is race safe, since on conflict it never overwrites tokenhash, so whichever insert commits first permanently wins the dish id no matter how the reads interleaved. But the loser of that race may have already passed its own stale read and gone on to insert an entries row for that dish using its own callsign and token hash. Because the entries upsert only conditionally updates score, label, and stats, and never rewrites callsign or token hash, a row planted this way can keep showing the wrong callsign forever, even after the dishes table correctly reflects the real owner. This needs a colliding, not yet used dish id and a tight race window, so it is unlikely in practice, but the corruption would not self heal.
Smallest fix: wrap the dishes upsert and the per board entries upserts in a single env.DB.batch call so the whole request commits as one unit, and have the entries upsert always overwrite callsign and token hash on conflict rather than leaving them as they were. Left open rather than fixed here because this changes request structure, and the review's test plan only covers a single happy path submit, not a concurrency scenario.

### L2. A literal JSON null body returns a 500 instead of a 400
Status: fixed
Location: worker.js, handleSubmit(), right after JSON.parse.
Attack scenario: posting the literal body null was valid JSON, so it did not trip the parse error handler, and left b as null. Reading b.boards on a null value threw. The outer try and catch in the top level fetch handler caught it and returned a generic server error with status 500 instead of a clean 400. Nothing was corrupted and the worker kept serving other requests, this was only the wrong status code for one malformed input shape.
Fix applied: a guard, typeof b !== 'object' || b === null, now runs immediately after JSON.parse and returns a clean 400 "bad json" for a null or any non object top level body. The destructuring line right after it no longer needs its own || {} fallback, since b is guaranteed to be a real object by that point.
Verified: node --check passed, and the existing valid submit test still returns ok true, confirming the guard does not affect well formed requests.

### L3. Service worker caches every GET request, including cross origin ones
Status: fixed
Location: sw.js, the fetch event listener.
Attack scenario: the only filter in the fetch handler checked the request method, nothing checked the request origin. That meant calls the page makes to the leaderboard worker, GET /board, got cached the same way as the app's own files. This was minor on its own, board data is public and the stale while revalidate pattern self corrects on the next successful fetch, but it did mean leaderboard results could be served briefly stale, and it widened the window for any single bad response, for example during an active network man in the middle attack, to get cached and replayed until the next successful fetch overwrote it.
Fix applied: one line added right after the method check. If the request URL's origin does not match self.location.origin, the handler now calls fetch(request) directly and returns, skipping the cache entirely for anything cross origin. The CACHE version constant was left untouched; it was already at soup-v42 from the other agent's changes before this review started.
Verified: node --check passed on the file.

## Informational, confirmed safe

I1. SQL injection: all six D1 queries in worker.js use numbered placeholders through bind, including the LIMIT clause in /board. No request data is ever concatenated into a SQL string anywhere in the file. No injection found.

I2. CORS: Access-Control-Allow-Origin star is safe here because there are no cookies and no ambient credentials of any kind. The only secret is the token carried explicitly in the POST body, which a third party page cannot forge or read unless it already has the token some other way. See H1 for the one real way that happens.

I3. Information disclosure from the API itself: GET /board never returns token or tokenhash, only callsign, dish, label, score, stats, and updated. Label is always built from clamped numbers on the server, never from user text. There is no offset parameter, only a limit clamped between 1 and 50, so the API cannot be used to dump a whole table, only the current top entries per board and day.

I4. DoS and indexing: the idx_board index on board, day, and score covers both the board listing query and the rank count query. LIMIT is clamped between 1 and 50 server side. No missing index or unbounded scan was found.

I5. Error handling: the top level fetch handler wraps routing in a try and catch and always returns a generic server error message on unexpected exceptions, never a stack trace or other internal detail.

I6. Input coercion: the callsign and dish regex is anchored, restricted to a safe character set, and has no nested or ambiguous repetition, so it is not vulnerable to catastrophic backtracking. The boards array is checked against a fixed allow list. Numeric stats fields go through bitwise or plain number coercion before being clamped, which safely turns not a number, infinity, objects, and arrays into a safe default rather than storing anything strange.

I7. BOARDS_URL: declared once in index.html as an empty string near the top of the file, and never reassigned anywhere else, confirmed by a full text search. It is not read from the page URL, a query string, a hash, or postMessage. It is currently empty, which is why the boards button is hidden, consistent with the leaderboard not being deployed yet.

I8. DOM insertion in renderBoards(): only e.callsign and e.label are ever written into innerHTML, and both are safe as used today, see M3 for the one related caveat about stats. curBoard is only ever set from a fixed data-board attribute on the page's own tab buttons, never from free text.

I9. logErr(): checked all three call sites in index.html. Every one logs either the browser's own window.onerror message or a generic prefix plus the error's own message, never dishToken or any other secret. Storage is bounded, at most 8 entries in local storage, each message cut to 200 characters, and rate limited, at most 5 log writes per unique message per 10 second window. No leak of dishToken was found through this path. The leak found in this review travels through the seed sharing feature instead, see H1.

I10. Repo wide secret scan: searched the whole tree, excluding .git, for API key patterns, AWS style keys, PEM private key headers, bearer tokens, password assignments, and email addresses. Nothing matched. No secrets, credentials, or personal data were found anywhere in the repository.

## What was fixed versus left open

Fixed across both rounds: M1 (first round), then H1, H2, M2, L2, and L3 (second round, once index.html was free to edit). That is six of eight findings.

Left open: M3 needs a server side allow list for the stats fields plus a client side escaping convention that does not exist yet in the codebase; it is a small change in shape but touches how stats are stored and is better done together with whatever future feature first renders them, rather than half built now. L1 needs the dishes upsert and the entries upserts wrapped in a single transactional batch, which changes request structure enough that it deserves its own concurrency test, not just the single happy path submit this review's test plan covers.

## Verification, second round

node --check passed on worker.js, sw.js, and the inline script extracted from index.html. A dash grep for em and en dashes came back clean on index.html, worker.js, schema.sql, and sw.js. A fresh local D1 schema load (including the new ips table) was applied, wrangler dev was run on port 8792, /health returned ok true, a modest submit (gen 3) returned ok true, a submit with gen 9999 on a brand new dish was rejected 422 for implausible generation, and the ips table showed the expected counts (submits 2, dishes 2) for the test client across those two submits. wrangler dev was then stopped and .wrangler was removed. The H1 fix was separately verified live in the browser pane, described in full under H1 above.
