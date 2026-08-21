# CV LaTeX — Võ Vương Khánh Vy (Dược sĩ Cao đẳng)

CV một trang, hai cột, dùng để ứng tuyển vị trí **nhân viên nhà thuốc / quầy thuốc**
tại TP. Cần Thơ.

📄 Bản PDF đã biên dịch sẵn: **[`CV_VoVuongKhanhVy.pdf`](CV_VoVuongKhanhVy.pdf)**

## Nội dung thư mục

| Tệp | Mô tả |
| --- | --- |
| `main.tex` | Nội dung CV — **sửa tệp này khi cần cập nhật thông tin** |
| `main.cls` | Lớp trình bày (bố cục, màu sắc, các lệnh tự định nghĩa) |
| `avatar.jpg` | Ảnh chân dung, nền đã đổi sang màu xanh của cột trái |
| `avatar-nen-xanh-duong.jpg` | Ảnh gốc nền xanh dương (ảnh thẻ), dùng khi muốn giữ nguyên nền |
| `Makefile` | Lệnh biên dịch nhanh |
| `LICENSE-template.txt` | Giấy phép MIT của mẫu gốc |

## Cách biên dịch

CV có dấu tiếng Việt nên **bắt buộc dùng XeLaTeX** (hoặc LuaLaTeX), không dùng pdfLaTeX.

### Cách 1 — Overleaf (dễ nhất, không cần cài gì)

1. Tải cả thư mục `cv/` lên [Overleaf](https://www.overleaf.com/) dưới dạng dự án mới.
2. Vào **Menu → Compiler** → chọn **XeLaTeX**.
3. Chọn `main.tex` làm *Main document* rồi bấm **Recompile**.

### Cách 2 — Máy cá nhân

```bash
cd cv
make            # tạo ra CV_VoVuongKhanhVy.pdf
make clean      # xoá các tệp trung gian
```

Hoặc chạy trực tiếp (chạy 2 lần để hyperref cập nhật đúng):

```bash
xelatex main.tex && xelatex main.tex
```

Yêu cầu: một bản TeX Live/MiKTeX có `fontspec`, `polyglossia`, `fontawesome5`,
`paracol`, `tcolorbox`, `environ`, `adjustbox`, `anyfontsize`, `tikz`.
Trên Ubuntu/Debian:

```bash
sudo apt install texlive-xetex texlive-latex-extra texlive-fonts-extra \
                 texlive-lang-other fonts-texgyre fonts-roboto-unhinted
```

## Cách chỉnh sửa nội dung

Mọi thông tin đều nằm trong `main.tex`:

- **Cột trái** (`leftpart`): ảnh, họ tên, chức danh, thông tin liên hệ, kỹ năng, định hướng.
- **Cột phải** (`rightpart`): tóm tắt, kinh nghiệm, học vấn, chứng chỉ, điểm mạnh.

Một số lệnh hay dùng:

| Lệnh | Công dụng |
| --- | --- |
| `\intro{ảnh}{họ tên}{chức danh}` | Khối đầu cột trái |
| `\phonelink{hiển thị}{số để bấm gọi}` | Số điện thoại |
| `\mailaddress{email}` · `\birthday{ngày}` · `\location{địa chỉ}` | Thông tin liên hệ |
| `\skillset{tên kỹ năng}{0–100}` | Kỹ năng kèm thanh mức độ |
| `\sideitem{nội dung}` | Gạch đầu dòng ở cột trái |
| `\jobset{chức danh}{nơi làm việc}{thời gian}{nội dung}` | Một mục kinh nghiệm |
| `\eduset{trường/bằng cấp}{thời gian}` | Một mục học vấn |
| `\certset{tên chứng chỉ}{ghi chú}` | Một mục chứng chỉ (để trống `{}` nếu không có ghi chú) |
| `\dotteddivider` | Đường kẻ chấm ngăn cách |

Đổi màu chủ đạo: sửa `\definecolor{DGreen}{HTML}{084B41}` trong `main.cls`.

### Thay ảnh chân dung

Đặt ảnh **vuông** (tỷ lệ 1:1) tên `avatar.jpg` vào thư mục này — ảnh sẽ tự
được cắt tròn. Nếu ảnh gốc là ảnh thẻ nền xanh dương, có thể giữ nguyên bằng cách
sửa `main.tex` thành `\intro{avatar-nen-xanh-duong.jpg}{...}{...}`.

## Nguồn mẫu

Dựa trên `template-2` của [amirzenoozi/latex-cv-templates](https://github.com/amirzenoozi/latex-cv-templates)
(MIT License). Lớp `main.cls` đã được chỉnh sửa để:

- chuyển sang XeLaTeX + `fontspec`/`polyglossia` cho tiếng Việt có dấu;
- dùng `fontawesome5` (bản `fontawesome` v4 không có tệp `.otf` cho XeLaTeX);
- tăng độ tương phản chữ trên nền xanh (`White!50` → `White!88`) để in rõ hơn;
- bổ sung các lệnh `\birthday`, `\phonelink`, `\sideitem`, `\jobset`, `\certset`,
  `\tightsect` và môi trường `cvitems`.
