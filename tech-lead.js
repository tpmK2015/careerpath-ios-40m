window.TechLeadStudy = {
  weeks: [
    ['1 · Kiến trúc và API', 'Vẽ luồng từ app đến API và PostgreSQL. Chọn cách phân trang, phân quyền và chống tạo trùng khi client gửi lại.', 'Sơ đồ luồng, API contract và một ADR giải thích quyết định.'],
    ['2 · DevOps và CI/CD', 'Đóng gói API bằng Docker. Tạo pipeline GitHub Actions chạy lint, test, build và triển khai staging. Thực hành rollback.', 'Một PR có pipeline xanh, log deploy và ghi lại thời gian rollback.'],
    ['3 · Cloud và bảo mật', 'Chọn một cloud. Học IAM quyền tối thiểu, networking, secrets, sao lưu, IaC và cách ước lượng chi phí. Dùng Docker hoặc Terraform plan trên máy trước.', 'Sơ đồ staging/production, danh sách quyền, chi phí ước tính và bài kiểm tra khôi phục.'],
    ['4 · Vận hành và xử lý sự cố', 'Đặt SLO cho API. Theo dõi p95 latency, lỗi 5xx và trace ID. Mô phỏng lỗi cơ sở dữ liệu trên staging.', 'Dashboard, runbook và postmortem có người chịu trách nhiệm cho từng hành động.'],
    ['5 · Claude API và ứng dụng AI', 'Dùng TypeScript viết adapter Claude với dữ liệu giả. Thực hành streaming, tool use, retry có giới hạn, quản lý ngữ cảnh và chọn model bằng phép đo.', 'Fixture API, test luồng lỗi, bảng chất lượng/chi phí/độ trễ. Có thể dùng response giả để học với chi phí $0.'],
    ['6 · Claude Code, MCP và kỹ năng dẫn dắt', 'Viết CLAUDE.md, thử một MCP tool chỉ đọc dữ liệu mẫu, thiết kế eval và review quyền. Trình bày quyết định với người học cùng hoặc tự quay demo bằng tiếng Anh.', 'Một PR có review, bộ eval, bản demo 5 phút và câu chuyện STAR về quyết định kỹ thuật.']
  ],
  jobs: [
    ['Techvify · Technical Lead', 'Kiến trúc, CI/CD, cloud, code review và mentoring. Tin ghi tối đa 60 triệu đồng/tháng.', 'https://careers.techvify.com/jobs/technical-lead'],
    ['PMAX · Software Engineering Lead', 'Chịu trách nhiệm backend từ thiết kế đến triển khai, theo dõi vận hành và đào tạo đội.', 'https://pmax.com.vn/careers/software-engineering-lead/'],
    ['Gapo · DevOps/SecOps Team Leader', 'Linux, networking, Kubernetes, Terraform và dẫn dắt thực hành DevOps/SRE.', 'https://g-group.vn/tuyen-dung/devops-secops-team-leader'],
    ['Hitachi · Senior Platform Engineering Lead', 'Nền tảng cloud, Kubernetes, CI/CD, logging, metrics và tracing.', 'https://careers.hitachi.com/senior-platform-engineering-lead/job/R0135165']
  ],
  study: [
    ['Developer Foundations Exam Guide', 'https://cc.sj-cdn.net/instructor/6nizmqk8tpzpfjvt6qmmav7rh/public/1794946716/Claude_Certified_Developer_-_Foundations_Exam_Guide.pdf'],
    ['Khóa ôn Developer Foundations miễn phí', 'https://anthropic-partners.skilljar.com/path/claude-certified-developer-foundations'],
    ['Danh mục chứng chỉ, lệ phí và đăng ký', 'https://anthropic-partners.skilljar.com/page/partner-certifications'],
    ['FAQ Anthropic Partner Academy', 'https://anthropic-partners.skilljar.com/page/faq-certifications']
  ],
  mock: [
    ['API integration', 'A streaming response ends after a partial tool input. What should the client do?', ['Execute the partial input', 'Treat the stream as incomplete and recover before executing the tool', 'Create a success record immediately'], [1], 'Chỉ chạy tool sau khi đầu vào hoàn tất và hợp lệ.'],
    ['API integration', 'An overnight job classifies 10,000 documents and users do not need live results. Which API mode best fits?', ['Message Batches', 'One interactive streaming session per file', 'A single prompt containing every file'], [0], 'Batch phù hợp với tác vụ bất đồng bộ khối lượng lớn.'],
    ['API integration', 'The service receives intermittent HTTP 429 responses. Select two actions.', ['Retry every request immediately', 'Bound concurrency', 'Use bounded backoff and respect Retry-After when present', 'Increase prompt length'], [1,2], 'Giảm tải đồng thời và giãn retry để tránh khuếch đại lỗi.'],
    ['Agents and workflows', 'Every invoice follows the same validate, extract, and review steps. What should orchestrate the process?', ['An open-ended agent with no stop condition', 'A deterministic workflow with a review branch', 'An agent with production database write access'], [1], 'Luồng cố định dễ kiểm thử và dễ truy vết các trường hợp cần duyệt.'],
    ['Agents and workflows', 'An assistant can request an irreversible account closure. Where should confirmation be enforced?', ['Only in the system prompt', 'Only in a tooltip', 'In the application before calling the write operation'], [2], 'Kiểm tra quyền và xác nhận ở nơi thực thi hành động.'],
    ['Claude Code', 'A team wants Claude Code to reuse repository conventions and constrain command permissions. Which two artifacts fit?', ['CLAUDE.md for project instructions', 'Shared settings.json for permission configuration', 'A secret embedded in README', 'A per-user chat transcript'], [0,1], 'Hướng dẫn dự án và cấu hình quyền phục vụ hai mục đích khác nhau.'],
    ['Evaluation', 'After changing a prompt, one demo looks good. What should happen before release?', ['Run a fixed evaluation set with edge cases and compare results to the baseline', 'Ship because the demo worked', 'Increase max_tokens for every request'], [0], 'Bộ eval cố định giúp phát hiện hồi quy có thể lặp lại.'],
    ['Model selection', 'A cheaper model passes most simple cases and struggles on a hard subset. What should you measure before switching?', ['Only the vendor list price', 'Only average output length', 'Quality by case, latency and end-to-end cost against the baseline'], [2], 'Chất lượng theo nhóm tình huống cho biết khi nào cần model mạnh hơn.'],
    ['Model optimization', 'An application reuses a long policy across requests with changing user input. What should remain stable for prompt caching?', ['A shared prefix before changing content', 'A randomly ordered instruction block', 'A timestamp at the beginning of every request'], [0], 'Prefix ổn định giúp các request dùng lại phần cache đủ điều kiện.'],
    ['Prompt and context', 'Extraction sometimes invents missing fields from incomplete documents. Which two changes help?', ['Specify how to represent missing values', 'Require a guess for every field', 'Validate output against a schema and test incomplete inputs', 'Remove all examples and constraints'], [0,2], 'Quy ước biểu diễn dữ liệu thiếu và kiểm tra hợp đồng đầu ra.'],
    ['Security', 'A retrieved document instructs the model to disclose secrets. What is the strongest engineering control?', ['Tell the model to obey the latest text', 'Keep credentials out of model context and enforce authorization at the tool boundary', 'Hide the instruction in the transcript'], [1], 'Nội dung truy xuất là dữ liệu. Quyền được kiểm tra ở ranh giới công cụ.'],
    ['Tools and MCP', 'A team exposes a ticket lookup via MCP. Which two choices improve safe reuse?', ['Grant read access only to authorized ticket scopes', 'Share an administrator token in client configuration', 'Describe and validate the tool input schema', 'Accept any backend query string'], [0,2], 'Quyền theo phạm vi và schema rõ ràng giảm thao tác ngoài ý muốn.']
  ]
};
