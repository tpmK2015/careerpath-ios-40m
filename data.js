/* CareerPath iOS 40M · curated 125-day learning roadmap. No external dependencies. */
window.CareerPathData = (() => {
  const START = '2026-11-10';
  const END = '2027-03-14';
  const TET = '2027-02-06';
  const TARGET = 40;
  const CURRENT = 25;
  const RESOURCES = {
    swift: {name:'The Swift Programming Language', from:'Swift.org', url:'https://docs.swift.org/swift-book/documentation/the-swift-programming-language/'},
    arc: {name:'Automatic Reference Counting', from:'Swift.org', url:'https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/'},
    concurrency: {name:'Swift Concurrency', from:'Apple Developer', url:'https://developer.apple.com/documentation/swift/concurrency'},
    strict: {name:'Adopting Swift 6', from:'Apple Developer', url:'https://developer.apple.com/documentation/swift/adoptingswift6'},
    swiftui: {name:'SwiftUI', from:'Apple Developer', url:'https://developer.apple.com/documentation/swiftui'},
    uikit: {name:'UIKit', from:'Apple Developer', url:'https://developer.apple.com/documentation/uikit'},
    networking: {name:'URLSession', from:'Apple Developer', url:'https://developer.apple.com/documentation/foundation/urlsession'},
    security: {name:'OWASP MASVS', from:'OWASP', url:'https://mas.owasp.org/MASVS/'},
    swiftdata: {name:'SwiftData', from:'Apple Developer', url:'https://developer.apple.com/documentation/swiftdata'},
    testing: {name:'Swift Testing', from:'Apple Developer', url:'https://developer.apple.com/documentation/testing'},
    instruments: {name:'Instruments', from:'Apple Developer', url:'https://developer.apple.com/documentation/xcode/analyzing-the-performance-of-your-shipping-app'},
    cicd: {name:'GitHub Actions', from:'GitHub Docs', url:'https://docs.github.com/en/actions'},
    store: {name:'App Review Guidelines', from:'Apple Developer', url:'https://developer.apple.com/app-store/review/guidelines/'},
    dsa: {name:'LeetCode Practice', from:'LeetCode', url:'https://leetcode.com/problemset/'},
    system: {name:'App Architecture', from:'Apple Developer', url:'https://developer.apple.com/documentation/'},
    interview: {name:'STAR Interview Method', from:'MIT CAPD', url:'https://capd.mit.edu/resources/the-star-method-for-behavioral-interviews/'},
    jobs: {name:'ITviec – Việc làm iOS', from:'ITviec', url:'https://itviec.com/it-jobs/ios'},
  };
  const SKILLS = [
    {id:'swift', name:'Swift nâng cao & ARC', priority:'P0', target:'Giải thích value/reference, generic, retain cycle và tối ưu bộ nhớ', icon:'{}'},
    {id:'concurrency', name:'Swift Concurrency', priority:'P0', target:'async/await, actors, Sendable, cancellation, strict checking', icon:'↗'},
    {id:'swiftui', name:'SwiftUI + UIKit', priority:'P0', target:'Build UI production, lifecycle, navigation, state management', icon:'▣'},
    {id:'architecture', name:'Architecture & DI', priority:'P0', target:'MVVM, Clean Architecture, SPM modularization, trade-offs', icon:'◇'},
    {id:'network', name:'Networking & Security', priority:'P0', target:'URLSession, auth, retry, caching, secure storage', icon:'⌁'},
    {id:'data', name:'Persistence & Offline', priority:'P1', target:'SwiftData/Core Data, migration, sync conflicts, offline-first', icon:'▤'},
    {id:'testing', name:'Testing & CI/CD', priority:'P0', target:'Swift Testing, XCTest, UI test, GitHub Actions, release', icon:'✓'},
    {id:'performance', name:'Performance & Debugging', priority:'P1', target:'Instruments, memory leak, startup, scrolling, diagnostics', icon:'◷'},
    {id:'dsa', name:'Algorithms & System Design', priority:'P0', target:'Giải bài live và thiết kế ứng dụng rõ trade-off', icon:'⌘'},
    {id:'english', name:'English & Communication', priority:'P0', target:'Tự giới thiệu, code review, STAR, technical discussion', icon:'“'},
    {id:'career', name:'Portfolio & Job Search', priority:'P0', target:'CV định lượng, portfolio, ứng tuyển, đàm phán offer', icon:'↗'}
  ];
  // Each row: topic | specific study objective | hands-on assignment | tangible proof | interview prompt.
  const RAW_WEEKS = [
    {title:'Swift Core – tư duy Senior', phase:'NỀN TẢNG', skill:'swift', resource:'swift', outcome:'Tạo SwiftPlayground repo có ≥ 10 ví dụ + README lý giải trade-off', days:[
      'Value vs reference types|Ôn struct/class, copy semantics và mutability|Tạo benchmark nhỏ so sánh hành vi copy struct với class|Commit 2 ví dụ và giải thích kết quả|Khi nào nên dùng struct thay vì class?',
      'Generics & protocols|Học associatedtype, generic constraints, opaque types|Viết generic Repository<T> và 2 implementations mock|Repository API có test ví dụ|associatedtype khác generic parameter thế nào?',
      'Protocol-oriented design|Học protocol extension, default implementation, dispatch|Refactor service code từ inheritance sang protocol composition|Một PR với lý do thay đổi|Vì sao protocol extension đôi khi gây bất ngờ dispatch?',
      'Error handling chuẩn production|Ôn Result, throws, typed errors và do/catch|Viết typed AppError + map lỗi network sang UI messages|Bảng mapping 5 tình huống lỗi|Khi nào dùng throws thay vì Result?',
      'Closures & capture lists|Ôn escaping/non-escaping, capture, @Sendable|Tạo 3 closure demos và sửa retain cycle bằng weak/unowned|Code before/after + note|Khi nào weak và unowned khác nhau?',
      'Access control & Swift Package|Ôn public/internal/private, package API|Tách utilities thành package, thêm docs cho API công khai|Swift Package build thành công|Làm sao thiết kế public API ổn định?',
      'Ôn tuần 1 & challenge|Đọc lại notes, tự kiểm tra 6 chủ đề Swift|Từ đầu viết mini CLI budget tracker dùng protocol + generics|README 1 trang + tự chấm|Nói 2 phút về thiết kế của bạn không nhìn tài liệu?'
    ]},
    {title:'ARC, memory & API design', phase:'NỀN TẢNG', skill:'swift', resource:'arc', outcome:'Sửa leak thực tế và trình bày ownership graph trong 5 phút', days:[
      'ARC & ownership graph|Ôn strong/weak/unowned và deinit|Tạo sơ đồ reference giữa view model, coordinator, closure|1 sơ đồ + leak reproduction|ARC có phải garbage collector không?',
      'Retain cycle trong closures|Nghiên cứu completion, timer, NotificationCenter|Tạo demo leak bằng closure, sửa với capture list|Xcode Memory Graph ảnh before/after|Liệu mọi closure đều cần [weak self]?',
      'Delegates & memory lifecycle|Ôn weak delegate, AnyObject, observer removal|Viết delegate pattern, chạy deinit assertions|Unit test confirm object release|Vì sao delegate thường weak?',
      'Copy-on-write|Ôn CoW Array/Dictionary và hiệu ứng hiệu năng|Viết ví dụ isKnownUniquelyReferenced hoặc đo copy cost|Notes về CoW và trade-off|Lúc nào CoW vẫn tốn memory?',
      'API ergonomics|Ôn naming, immutability, access control, API evolution|Thiết kế lại public API của mini package tuần 1|API guide + changelog|Design API cho SDK tái sử dụng thế nào?',
      'Dependency lifetime|Ôn singleton anti-pattern và vòng đời dependencies|Refactor singleton thành injected service + scene scope|Bảng scope object|Khi nào singleton là hợp lý?',
      'Memory code review|Ôn 5 bug memory thường gặp|Làm code review bản code intentionally leaking|5 comments review + patch|Debug leak không tái hiện ổn định thế nào?'
    ]},
    {title:'Swift Concurrency – Swift 6', phase:'CHUYÊN MÔN', skill:'concurrency', resource:'concurrency', outcome:'Networking demo dùng async/await, actors, cancellation và strict checking', days:[
      'async/await nền tảng|Ôn structured concurrency, async throws|Convert callback-based API sang async/await|Commit API migration + tests|Async function khác escaping callback thế nào?',
      'Task & cancellation|Ôn Task, Task.checkCancellation, cancellation handler|Build search-as-you-type cancel request cũ|Video ngắn chứng minh cancellation|Cancellation có tự hủy network request không?',
      'TaskGroup|Học withTaskGroup vs async let, error propagation|Download đồng thời 5 thumbnail có giới hạn số task|Bảng timing tuần tự vs song song|Phân biệt async let và TaskGroup?',
      'Actors & isolation|Ôn actor, @MainActor, shared mutable state|Xây ImageCache actor an toàn khi concurrent access|Race-free test|Actor có loại bỏ mọi loại race không?',
      'Sendable & Swift 6|Đọc strict concurrency checking, Sendable, @Sendable|Bật strict concurrency, xử lý warnings trong demo|Screenshot build sạch warnings|Tại sao Swift 6 cảnh báo data race?',
      'Bridging legacy & Combine|Ôn withCheckedThrowingContinuation và AsyncSequence|Bridge một callback API sang async, thêm timeout|Code + test resolve exactly once|Continuation có rủi ro gì?',
      'Concurrency mock interview|Ôn actor reentrancy, priority, cancellation|Giải case download + cache + dedupe requests từ đầu|README kiến trúc + 3 tests|Thiết kế chống duplicate request như thế nào?'
    ]},
    {title:'SwiftUI production', phase:'CHUYÊN MÔN', skill:'swiftui', resource:'swiftui', outcome:'Khởi tạo SpendWise app: 4 màn hình với navigation và state management', days:[
      'State & identity|Ôn @State, @Binding, @Observable và view identity|Khởi tạo SpendWise app; model giao dịch và home screen|App chạy trên Simulator|View identity liên quan state như thế nào?',
      'NavigationStack|Ôn typed navigation, deep linking routes|Build màn hình dashboard → giao dịch → chi tiết|GIF navigation|Deep link tới detail cần xử lý gì?',
      'Reusable design system|Ôn ViewModifier, accessibility, dynamic type|Tạo Button/Card/Color/Typography tokens reusable|Components preview catalogue|Dùng design tokens vì sao quan trọng?',
      'Forms & validation|Ôn FocusState, Form, validation feedback|Build Add Expense form có validation & keyboard handling|Form hoạt động + lỗi rõ ràng|Validate client và server khác nhau?',
      'Data flow MVVM|Ôn state ownership, observable model, one-way flow|Tách màn hình danh sách sang ViewModel + protocol repository|ViewModel testable|Bao giờ không cần view model?',
      'Async UI states|Ôn loading/success/empty/error/retry|Build transaction list có skeleton/empty/retry views|Ảnh 4 states|Làm sao tránh state invalid?',
      'SwiftUI mini demo|Ôn những phần chưa vững và accessibility|Hoàn thiện 4 screens, chạy VoiceOver + Dynamic Type|Repo SpendWise milestone v0.1|Điểm yếu của SwiftUI trong app lớn?'
    ]},
    {title:'UIKit, lifecycle & interoperability', phase:'CHUYÊN MÔN', skill:'swiftui', resource:'uikit', outcome:'Tích hợp UIKit–SwiftUI, xử lý lifecycle và accessibility', days:[
      'UIKit layout|Ôn Auto Layout, reuse, diffable data source|Build UIKit TransactionsList bằng UITableView diffable|Demo UIKit list|Diffable datasource giải quyết gì?',
      'UIHostingController|Ôn embed SwiftUI trong UIKit|Nhúng SpendWise SwiftUI summary vào UIViewController|Flow UIKit → SwiftUI|Dùng UIHostingController khi nào?',
      'UIViewRepresentable|Ôn delegate coordinator & binding|Bọc một UIKit picker thành SwiftUI component|Reusable wrapped component|Coordinator dùng để làm gì?',
      'App lifecycle|Ôn Scene, background/foreground, app state restoration|Lưu trạng thái form khi background app rồi quay lại|Test scene transitions|App bị kill khi background xử lý ra sao?',
      'Deep links & universal links|Ôn routing, URL parsing, fail-safe navigation|Xử lý custom URL scheme tới Transaction detail|Deep link demo + invalid URL cases|Universal Link khác URL scheme?',
      'Accessibility|Ôn VoiceOver, Dynamic Type, reduce motion|Audit 4 màn hình bằng accessibility inspector|Danh sách 8 điểm đã sửa|Accessibility testing tự động mức nào?',
      'UIKit/SwiftUI interview|Ôn trade-offs về lifecycle, navigation|Thử viết 1 screen bằng cả UIKit và SwiftUI|Decision log 1 trang|Migrating UIKit app sang SwiftUI thế nào?'
    ]},
    {title:'Networking, auth & security', phase:'CHUYÊN MÔN', skill:'network', resource:'networking', outcome:'API layer production: retry, pagination, token handling, test doubles', days:[
      'URLSession & async client|Ôn URLRequest, URLSession, HTTP status & Codable|Build APIClient protocol với async request<T>|Unit test success/failure|Phân biệt transport error và API error?',
      'Pagination & search|Ôn cursor/page pagination và debounce|Build paginated transactions feed (mock API)|Pagination UI có loading/error|Tránh duplicate items khi phân trang thế nào?',
      'Retry & exponential backoff|Ôn idempotency, jitter, timeout|Thêm retry cho GET với max attempts & cancellation|Tests for 429/500/timeouts|POST retry có an toàn không?',
      'Auth & Keychain|Ôn OAuth/token refresh, Keychain, principle least privilege|Tạo TokenStore protocol, Keychain impl, refresh flow mock|Sequence diagram token refresh|Tránh concurrent token refresh thế nào?',
      'Transport security|Đọc ATS, TLS, certificate pinning trade-offs|Audit app security; thử pinning demo với explanation|Security checklist theo threat model|Pinning có nên luôn bật không?',
      'Caching & conditional requests|Ôn URLCache, ETag, stale-while-revalidate|Tạo image/data cache + offline placeholder|Cache test & README|Cache invalidation làm thế nào?',
      'Network resilience review|Ôn errors, pagination, auth, rate limiting|Viết network module README & integration tests|Architecture + 6 test cases|Design API client cho hàng triệu người dùng?'
    ]},
    {title:'Architecture, SOLID & DI', phase:'CHUYÊN MÔN', skill:'architecture', resource:'system', outcome:'Chuyển SpendWise sang modules UI / Domain / Data, viết ADR giải thích lựa chọn', days:[
      'MVVM trade-offs|Ôn MVVM, MVC, VIPER và boundaries|Vẽ sơ đồ luồng dữ liệu SpendWise|C4-like component diagram|MVVM có phải luôn tốt hơn MVC?',
      'SOLID thực chiến|Ôn SRP, DIP, ISP qua ví dụ Swift|Refactor God ViewModel thành 3 protocols|PR với reasons & tests|Ví dụ DIP trong iOS?',
      'Clean Architecture|Ôn Domain use case, data access inversion|Tạo GetTransactionsUseCase và AddExpenseUseCase|Unit tests không phụ thuộc UI|Tại sao domain không import SwiftUI?',
      'Dependency Injection|Ôn initializer injection, composition root|Xây AppContainer/protocol dependencies trong app|Swap in-memory vs persistent repo|DI framework có bắt buộc không?',
      'SPM modularization|Ôn Swift Package targets/dependencies|Tách DomainKit & DataKit & Feature module|Build pass với dependency direction|Giải quyết circular dependency thế nào?',
      'Decision records|Ôn ADR, trade-offs maintenance/cost/perf|Viết 2 ADR: storage, navigation, API client|2 ADR với alternatives|Bảo vệ quyết định kỹ thuật trước PM?',
      'Architecture walkthrough|Ôn toàn bộ layers và dependency graph|Record 5-minute architecture walkthrough|Video/slides + README|Nếu app scale 20 dev, tổ chức modules ra sao?'
    ]},
    {title:'Data, offline-first & sync', phase:'CHUYÊN MÔN', skill:'data', resource:'swiftdata', outcome:'SpendWise dùng local storage và hàng đợi sync offline demo', days:[
      'SwiftData models|Ôn schema, model context, query|Tạo transaction model và local repository|Persist 20 sample transactions|SwiftData vs Core Data trade-offs?',
      'Migrations|Ôn schema evolution & backward compatibility|Thêm trường category với migration strategy|Migration note + rollback plan|Migration thất bại ứng xử thế nào?',
      'Offline-first design|Ôn local source of truth, pending ops queue|UI hoạt động offline có thể thêm giao dịch|Airplane-mode demo|Offline-first khác offline cache?',
      'Sync strategy|Ôn optimistic updates, ordering, conflict resolution|Tạo SyncEngine mock với pending operations|Sync diagram + edge-case tests|Last-write-wins có rủi ro gì?',
      'Background tasks|Ôn background refresh limitations và power budget|Thử background synchronization khi có kết nối|Notes thực tế Simulator/device|iOS bảo đảm chạy background task không?',
      'Secure persistence|Ôn PII minimization, encryption, Keychain vs DB|Audit data classification; xóa sensitive debug logs|Security checklist|Không nên lưu dữ liệu nào vào UserDefaults?',
      'Persistence review|Ôn migration/recovery/conflict flow|Build demo offline→online & giải thích design|Video 2 phút + 5 tests|Thiết kế expense app trên thiết bị yếu thế nào?'
    ]},
    {title:'Unit, integration & UI testing', phase:'CHUYÊN MÔN', skill:'testing', resource:'testing', outcome:'≥ 25 bài test có ý nghĩa, CI-ready, có đo coverage', days:[
      'Swift Testing basics|Ôn @Test, #expect, parameterized tests|Viết tests cho Money/Category domain rules|8 tests pass|Swift Testing khác XCTest ở đâu?',
      'Mock & fake design|Ôn test doubles, spy, stub, fake|Tạo FakeTransactionRepository và tests ViewModel|Tests không dùng network thật|Mock nhiều quá gây vấn đề gì?',
      'Async testing|Ôn deterministic clock/cancellation tests|Test debounce, token refresh và cancellation|5 async tests|Tránh flaky async tests bằng cách nào?',
      'Networking contract tests|Ôn URLProtocol mock, validation status, decode|Test 200, 401, 429, malformed JSON|7 network tests|Integration vs unit testing?',
      'UI testing|Ôn XCUITest, accessibilityIdentifier|Viết test add expense → list → detail|1 end-to-end test pass|UI test thường flaky vì sao?',
      'Coverage & mutation mindset|Ôn coverage limits, boundary testing|Đo coverage và bổ sung 5 edge cases|Coverage report + rationale|100% coverage có đảm bảo chất lượng?',
      'Testing assessment|Ôn testing pyramid, hermetic tests|Chạy suite toàn app + sửa một flaky test|Badge/ảnh kết quả ≥25 tests|Test strategy khi release gấp?'
    ]},
    {title:'Performance, debugging & diagnostics', phase:'CHUYÊN MÔN', skill:'performance', resource:'instruments', outcome:'Báo cáo benchmark trước/sau cho 2 bottlenecks', days:[
      'Instruments overview|Ôn Time Profiler, Leaks, Allocations|Profile SpendWise trên Simulator/device|Screenshot baseline metrics|Dùng Time Profiler tìm hotspot thế nào?',
      'Scroll performance|Ôn LazyVStack, List identity, rendering work|Sinh 10k transactions và tối ưu scroll|Record baseline & improved behavior|Why stable identity matters?',
      'Memory leaks|Ôn retain cycles, memory graph, deallocation|Inject leak, find with Instruments, fix|Leak screenshots before/after|Strong reference giữ ViewModel ở đâu?',
      'Image caching|Ôn decoding/downsampling and caching cost|Implement thumbnail resizing + async cache|Latency/memory comparison|Giảm memory khi ảnh lớn thế nào?',
      'Startup & lazy loading|Ôn cold start vs warm start, heavy init|Move expensive initialization out of startup path|Startup comparison notes|Tối ưu startup ưu tiên gì?',
      'Logging & crash reasoning|Ôn os.Logger, signposts, error breadcrumbs|Thêm structured logs, crash reproduction checklist|Debug playbook|Debug issue chỉ có production logs?',
      'Performance review|Ôn profile-measure-optimize cycle|Viết performance case study cho CV|Bài viết có baseline/method/limitations|Bạn chứng minh tối ưu thực sự thế nào?'
    ]},
    {title:'Delivery, CI/CD & App Store', phase:'SẢN PHẨM', skill:'testing', resource:'cicd', outcome:'CI build/test tự động + release checklist', days:[
      'Git workflow & PR|Ôn trunk-based, code review, semantic commits|Chuẩn hóa branches, PR template và codeowners|PR template + sample PR|Mục tiêu code review tốt là gì?',
      'GitHub Actions CI|Ôn runner macOS, caching, secrets policy|Viết workflow chạy lint/build/test trên macOS runner|workflow YAML + successful run hoặc note giới hạn|Tại sao không để signing secrets trong git?',
      'Fastlane basics|Ôn automation build/signing và distribution|Tạo Fastfile skeleton + release scripts|Scripts có README|CI khác CD ở đâu?',
      'Versioning & feature flags|Ôn semantic releases, staged rollout, rollback|Tạo config flag để bật/tắt feature|Feature flag works in simulator|Release có thể rollback mọi thứ không?',
      'Privacy & App Review|Đọc App Review Guidelines + privacy labels|Tạo privacy audit và permission copy|Privacy checklist|ATT khác privacy labels?',
      'TestFlight rehearsal|Ôn certificates/profiles, builds, testers|Chuẩn bị archive; nếu có account, TestFlight internal|Archive/test checklist|Debug provisioning errors thế nào?',
      'Release readiness gate|Ôn crash-free goals và monitoring checklist|Run end-to-end regression + release notes|v0.9 release checklist|Senior engineer quyết định release dựa vào gì?'
    ]},
    {title:'Portfolio v1.0 – chứng minh năng lực', phase:'SẢN PHẨM', skill:'career', resource:'store', outcome:'SpendWise repo hoàn chỉnh: video demo, README, architecture, tests và câu chuyện impact', days:[
      'Finalize product scope|Rà soát user story, acceptance criteria|Chốt 4 core flows và loại bỏ feature thừa|Scope doc version 1|Bạn ưu tiên tính năng như thế nào?',
      'Visual polish|Rà soát accessibility, loading, errors, UX|Polish dashboard, list, add, detail|Video clip toàn luồng|Cách cân bằng UX với thời hạn release?',
      'Architecture & testing docs|Rà soát decision logs và module boundaries|Viết README architecture + local run + tests|README đầy đủ, dễ setup|Bạn sẽ onboard dev mới trong 30 phút ra sao?',
      'Bug bash & stability|Ôn quality gates, crash reporting tradeoffs|Manual test 15 scenarios và fix top bugs|Bug log 15 cases|Trường hợp edge nào thường bị quên?',
      'Demo storytelling|Ôn STAR impact, technical depth|Record demo 2–3 phút, kể tech decisions|Demo video/link bản địa|Pitch dự án trong 90 giây?',
      'Portfolio & GitHub polish|Ôn README design, commit hygiene, demo safety|Pin repo, add screenshots, release notes, LICENSE|Public/private portfolio ready|Portfolio tốt hơn code dump ở đâu?',
      'End-to-end mock review|Đóng vai reviewer đọc toàn bộ repo|Self-review theo rubric senior và sửa 3 issues|Rubric score + next actions|Điểm kỹ thuật khó nhất của dự án là gì?'
    ]},
    {title:'Tết: thuật toán & duy trì nhịp', phase:'PHỎNG VẤN', skill:'dsa', resource:'dsa', outcome:'7 bài DSA có giải thích complexity; linh hoạt sắp xếp quanh Tết 06/02', days:[
      'Arrays & hashing|Ôn O(n), two-sum, frequency map|Giải Two Sum + Group Anagrams Swift|Solutions có time/space complexity|Tại sao hash table average O(1)?',
      'Two pointers|Ôn sorted arrays, invariants|Giải Valid Palindrome + Container With Most Water|Swift solutions + tests|Two pointers khi nào áp dụng?',
      'Sliding window|Ôn fixed vs variable window|Giải Longest Substring Without Repeating Characters|Solution + trace 2 examples|Chứng minh O(n) cho sliding window?',
      'Stacks & queues|Ôn monotonic stack, LIFO/FIFO|Giải Valid Parentheses + Daily Temperatures|Solutions + tests|Monotonic stack dùng ở đâu?',
      'Tết – ôn nhẹ có mục tiêu|Ôn flashcards 15 câu Swift, giải thích bằng miệng|Giải 1 bài easy bất kỳ không xem đáp án trước|1 solution + 3 bài nhớ lại|Kể 1 quyết định kỹ thuật gần đây?',
      'Tết – binary search|Ôn invariant và boundary conditions|Giải Binary Search + Search in Rotated Sorted Array|Solutions + notes off-by-one|Vì sao lo/hi hay gây bug?',
      'Tết – linked list|Ôn pointers, cycle, reversal|Giải Reverse Linked List + Linked List Cycle|Swift solution + tests|Fast/slow pointer hoạt động thế nào?'
    ]},
    {title:'System design iOS & live coding', phase:'PHỎNG VẤN', skill:'dsa', resource:'system', outcome:'Có 3 bản thiết kế whiteboard + 2 mock interviews', days:[
      'Design offline expense app|Ôn functional/non-functional requirements|Thiết kế architecture SpendWise từ zero trên bảng|1 system diagram + API contracts|Xử lý offline writes và conflicts?',
      'Design image feed|Ôn pagination, caching, image pipeline|Thiết kế feed 1000 items cho mạng yếu|Architecture 1 trang|Tránh duplicate image downloads thế nào?',
      'Design chat notification|Ôn APNs basics, local DB, ordering|Thiết kế chat inbox có unread count|Sequence diagram|Notification không đảm bảo thứ tự xử lý sao?',
      'Debugging interview|Ôn crash, memory, race, test strategies|Làm case app crash lúc background resume|Root-cause tree|Bạn cần log gì đầu tiên?',
      'Live code mock 1|Ôn Swift collections & complexity|Giải 1 medium 45 phút, verbalize reasoning|Record & debrief|Bạn cân nhắc edge cases ra sao?',
      'Live code mock 2|Ôn cancellation & async API|Implement async image loader có dedupe + cancel|Working code under timebox|Bạn kiểm thử concurrency như thế nào?',
      'System design checkpoint|Ôn scalability, reliability, observability|Thuyết trình 10 phút 1 thiết kế, tự phản biện|Interview notes + scorecard|Trade-off nào bạn sẽ thay đổi khi scale 10x?'
    ]},
    {title:'CV, tiếng Anh & mở pipeline', phase:'ỨNG TUYỂN', skill:'english', resource:'interview', outcome:'CV 1–2 trang, 1 pitch English, shortlist 15 jobs phù hợp', days:[
      'CV với tác động thực tế|Ôn impact bullets: action + scale + outcome|Viết 5 bullet từ dự án FPT, không lộ thông tin mật|CV draft + bằng chứng số liệu nếu có|Describe your biggest achievement?',
      'English self-introduction|Ôn pitch 60–90 seconds|Record giới thiệu kinh nghiệm iOS bằng English|Audio tự đánh giá 3 lỗi|Tell me about yourself?',
      'Behavioral STAR|Ôn STAR và ownership stories|Viết 4 câu chuyện: conflict, incident, impact, leadership|4 STAR cards|Tell me about a tough bug?',
      'Technical storytelling|Ôn architecture, concurrency, testing vocabulary|Giải thích SpendWise architecture 5 phút bằng English|Recording + glossary|How did you structure your codebase?',
      'Market mapping|Ôn đánh giá JDs theo must-have/nice-to-have|Lập shortlist 15 công ty, score tech/comp/remote|15 targeted roles + links|Bạn sẽ chọn offer dựa trên tiêu chí nào?',
      'CV tailoring & LinkedIn|Ôn ATS-friendly CV và quantified claims|Chỉnh CV theo 2 JD; cập nhật profile/GitHub|2 CV variants ready|Tại sao chọn công ty này?',
      'Apply batch 1|Ôn email / referrals & interview availability|Gửi 3 hồ sơ chất lượng, ghi status & ngày follow-up|3 applications logged|Tại sao mức lương kỳ vọng 40 triệu?'
    ]},
    {title:'Mock interview & ứng tuyển chủ động', phase:'ỨNG TUYỂN', skill:'career', resource:'jobs', outcome:'8–12 hồ sơ chất lượng + 2 mock sessions + lời giới thiệu mạch lạc', days:[
      'Senior Swift oral mock|Ôn 15 câu Swift/ARC/concurrency|Tự trả lời thành tiếng có timebox 60 phút|Scorecard câu yếu|When would you use an actor?',
      'Portfolio defence|Ôn kiến trúc, design trade-offs và tests|Mock interview giải thích SpendWise 30 phút|Answer bank 10 câu|What would you redesign with 6 months?',
      'Applications batch 2|Ôn role scoring and compensation bands|Ứng tuyển 3 job phù hợp + cá nhân hóa CV|3 applications logged|What motivates you to leave?',
      'Behavioral English mock|Ôn 4 STAR stories|Mock HR interview bằng English; nghe lại recording|Feedback và revised scripts|Tell me about a disagreement?',
      'Coding challenge sprint|Ôn 2 patterns sai nhiều nhất|Giải 2 bài medium với giới hạn thời gian|Solutions + retrospectives|Optimize brute-force implementation?',
      'Referral & follow-ups|Ôn networking etiquette và follow-up|Viết 3 tin nhắn referral; theo dõi hồ sơ gửi ≥5 ngày|Follow-up tracker|What is your notice period?',
      'Interview week review|Ôn điểm yếu qua 2 mocks|Chấm skill matrix, chọn top 3 gaps để vá|Priority repair list|Điều gì bạn chưa chứng minh được?'
    ]},
    {title:'Phỏng vấn thật & sửa điểm yếu', phase:'ỨNG TUYỂN', skill:'career', resource:'jobs', outcome:'Pipeline được cập nhật; thực hiện interview thật hoặc 3 mock thay thế', days:[
      'Gap repair: concurrency|Ôn weak area đã lộ ở mock|Tái implement actor cache hoặc cancel flow từ memory|Code without notes|Task vs detached task khác gì?',
      'Gap repair: architecture|Ôn trade-offs và modular boundaries|Vẽ lại architecture 30 phút rồi phản biện|Refined diagram|Viết maintainable iOS app ở team lớn?',
      'Applications batch 3|Ôn job scoring, target salary clarity|Ứng tuyển 3 roles phù hợp, tìm referral|3 more applications logged|Why are you worth 40 million?',
      'Interview simulation full|Ôn intro + live code + system design|90-min simulated panel + 30-min review|Rubric & weakness backlog|Explain a recent tough technical decision?',
      'Compensation & total package|Ôn gross/net, bonus, probation, equity, insurance|Tạo offer comparison worksheet giả lập|Decision criteria + salary script|Expected salary & why?',
      'Production ownership|Ôn incidents, release risk, communication|Viết postmortem giả lập về lỗi sync mất dữ liệu|Postmortem no-blame 1 trang|How did you manage production outage?',
      'Pipeline retrospective|Ôn phản hồi từ nhà tuyển dụng|Follow up hồ sơ, cập nhật CV theo tín hiệu thật|Pipeline summary|Nếu chưa có interview, thay chiến lược thế nào?'
    ]},
    {title:'Chốt offer & kế hoạch dự phòng', phase:'ỨNG TUYỂN', skill:'career', resource:'jobs', outcome:'Sẵn sàng quyết định offer 40M có bằng chứng; phương án nếu chưa đạt', days:[
      'Company due diligence|Ôn financial stability, stack, team health, product|Lập checklist 12 câu hỏi cho hiring manager|Questions shortlist|How do you evaluate team culture?',
      'Technical final round|Ôn 3 chủ đề khó nhất từ feedback|Mock final round: concurrency, testing, architecture|Mock scorecard|What compromises did you make?',
      'Offer negotiation|Ôn BATNA, total compensation & review cycles|Tập 3 scripts negotiate 40M gross/net rõ ràng|Negotiation script|What range do you expect?',
      'Contract & transition|Ôn notice, probation, IP ownership, non-compete|Viết handover plan và checklist trước khi resign|Handover template|How would you transition current work?',
      'Offer compare & constraints|Ôn lương cơ bản, thưởng, bảo hiểm, location & growth|So sánh giả lập 3 offers theo weighted criteria|Offer decision matrix|What matters beyond compensation?',
      'Tổng kết & kế hoạch B|Ôn toàn bộ kỹ năng, feedback thật và gap analysis|Export tiến độ, tổng kết portfolio, CV, interviews; nếu chưa đạt offer, lên sprint 30 ngày|Bản tổng kết + kế hoạch 30 ngày có KPI|Nếu offer thấp hơn mục tiêu, bạn quyết định thế nào?',
      'Ngày tổng kết hành trình|Ôn toàn bộ 17 tuần, những gì đã xây|Export dữ liệu, recap commits & applications|Portfolio + CV + 30-day next steps|Tại sao bạn sẵn sàng cho Senior iOS?'
    ]}
  ];
  const phases = [
    {label:'NỀN TẢNG', description:'Swift, ARC và ownership; xây lõi giải thích sâu'},
    {label:'CHUYÊN MÔN', description:'Concurrency, UI, mạng, architecture, dữ liệu, kiểm thử, hiệu năng'},
    {label:'SẢN PHẨM', description:'CI/CD, release và portfolio có bằng chứng'},
    {label:'PHỎNG VẤN', description:'Coding, iOS system design và mô phỏng phỏng vấn'},
    {label:'ỨNG TUYỂN', description:'CV, tiếng Anh, applications, offer và thương lượng'}
  ];
  const days = [];
  const fromIsoUTC = iso => new Date(`${iso}T12:00:00Z`);
  const isoAdd = (iso, n) => {
    const date = fromIsoUTC(iso); date.setUTCDate(date.getUTCDate() + n);
    return date.toISOString().slice(0, 10);
  };
  RAW_WEEKS.forEach((week, wi) => {
    week.days.forEach((raw, di) => {
      const id = wi * 7 + di;
      const date = isoAdd(START, id);
      if (date > END) return;
      const [title,study,practice,proof,question] = raw.split('|');
      days.push({id, date, week:wi+1, day:di+1, phase:week.phase, weekTitle:week.title, skill:week.skill,
        title, study, practice, proof, question, resource:week.resource,
        tasks:[
          {id:'learn', minutes:30, label:'Nắm kiến thức', detail:study},
          {id:'build', minutes:70, label:'Code thực chiến', detail:practice},
          {id:'review', minutes:20, label:'Chứng minh & tự vấn', detail:`${proof}. Tự trả lời: “${question}”`},
        ]});
    });
  });
  const WEEKS = RAW_WEEKS.map((w,i)=>({id:i+1, ...w, days:days.filter(d=>d.week===i+1).map(d=>d.id)}));
  const QUESTIONS = [
    ['Swift','struct và class khác nhau ở semantics và ARC?'],
    ['Swift','Copy-on-write khi nào thật sự copy?'],
    ['Swift','weak và unowned dùng trong trường hợp nào?'],
    ['Swift','Protocol extension dispatch có bẫy gì?'],
    ['Swift','Generics và associatedtype khác nhau?'],
    ['Concurrency','Structured concurrency khác Task.detached ở đâu?'],
    ['Concurrency','Actor reentrancy là gì?'],
    ['Concurrency','@MainActor có đảm bảo không bao giờ block UI?'],
    ['Concurrency','Sendable / strict concurrency ngăn race thế nào?'],
    ['Concurrency','Hủy Task khi user đổi màn hình thế nào?'],
    ['SwiftUI','@State, @Binding, @Observable khác nhau thế nào?'],
    ['SwiftUI','Điểm mạnh/yếu của NavigationStack?'],
    ['UIKit','SwiftUI và UIKit phối hợp trong app legacy ra sao?'],
    ['Networking','Thiết kế APIClient có retry, auth refresh và cancellation?'],
    ['Security','Keychain, ATS, certificate pinning dùng khi nào?'],
    ['Architecture','Thiết kế Clean Architecture thực dụng trong iOS?'],
    ['Architecture','Lựa chọn MVVM hay MVC dựa trên tiêu chí gì?'],
    ['Data','Offline-first và xử lý xung đột sync thế nào?'],
    ['Testing','Test async code tránh flaky tests thế nào?'],
    ['Performance','Tìm retain cycle và bottleneck scroll bằng công cụ nào?'],
    ['Delivery','CI/CD iOS cần build, sign, test, distribute ra sao?'],
    ['System Design','Thiết kế feed có pagination/cache/offline?'],
    ['Behavioral','Kể một lần giải quyết incident production theo STAR.'],
    ['Career','Vì sao bạn phù hợp với mức lương mục tiêu 40 triệu?']
  ];
  return {START, END, TET, TARGET, CURRENT, RESOURCES, SKILLS, WEEKS, days, phases, QUESTIONS};
})();
