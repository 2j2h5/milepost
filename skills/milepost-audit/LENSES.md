# Lenses

Each lens agent reads only its own section. Write items in general terms; never name a project, a library or an incident the lens was tested against.

## trust (TR): promises and trust boundaries

Start from: map sections 4 (T) and 5 (P).

- Data from outside (another program's output, files, messages, the network, user input) that becomes a path, a command, a navigation, a network access or a write.
- Control signals carried inside data (escape sequences, markers, magic strings) that the code believes without checking who sent them.
- Embedded browsers and web views: navigation, new windows, link handling, messages from the page.
- Who else can connect to a pipe, socket, port or shared file, and what they can make the code do.
- Promises that something never happens ("never deletes", "never sends"): look for an input that makes it happen.
- Deep security review (memory safety, crypto, auth flows) belongs to a security scanner; note it only where a promise or boundary leads there.

## concurrency (CO): threads, blocking, shared state

Start from: map section 3 (processes and threads) and section 4.

- Blocking I/O, waits or slow calls on a UI thread or an event loop, including file checks that can hit the network.
- Blocking calls made while holding a lock, and locks taken in different orders.
- State shared between threads without a lock, or read and written in steps that can interleave.
- A writer whose reader stops reading: what fills up and who waits.
- Message floods: one message per small chunk crossing threads or processes.

## failure (FA): errors and recovery

Start from: map section 3 and section 5.

- Exception paths that can crash or freeze the host process, or skip cleanup.
- State left behind after a failure: a cached failed result, queued items that never clear, half-applied changes.
- Handles, processes and other resources that are not released.
- What the user sees when a required component is missing or fails to start.
- Logs that grow without limit or record what they should not.

## supply (SU): build, dependencies, install

Start from: map section 1 (build) and boundaries entered at build or install time.

- Dependencies fetched without a pinned version or an integrity check, and where the fetched code ends up running.
- Inconsistencies: one script verifies hashes, another does not.
- Build reproducibility: tools, versions and paths taken from the machine.
- Install and uninstall steps that change system state or leave it behind.
- Licence notices for what is shipped.

## maintain (MA): tests, docs, repository

Start from: map sections 6 (C) and 2 (files).

- Pure logic (parsers, state machines) with no tests, and whether any CI runs the tests that exist.
- Claims in docs and comments that the code contradicts, and references to documents that are not in the repository.
- Version numbers: where they live and whether builds carry them.
- Large binaries tracked in git (`git ls-files` with sizes; do not open them).
