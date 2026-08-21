# Hồ sơ xin việc LaTeX — Võ Vương Khánh Vy (Dược sĩ Cao đẳng)

Bộ hồ sơ gồm **CV** và **Đơn xin việc**, mỗi tài liệu một trang, cùng một mẫu thiết kế,
dùng để ứng tuyển vị trí **Dược sĩ tư vấn / nhân viên nhà thuốc** tại TP. Cần Thơ.

📄 CV: **[`CV_VoVuongKhanhVy.pdf`](CV_VoVuongKhanhVy.pdf)**
✉️ Đơn xin việc: **[`DonXinViec_VoVuongKhanhVy.pdf`](DonXinViec_VoVuongKhanhVy.pdf)**
📝 Hướng dẫn nộp hồ sơ: **[`HUONG-DAN-UNG-TUYEN.md`](HUONG-DAN-UNG-TUYEN.md)**

## Nội dung thư mục

| Tệp | Mô tả |
| --- | --- |
| `cauhinh.tex` | **Thông tin liên hệ, ảnh, màu sắc — dùng chung cho cả 2 tài liệu.** Sửa ở đây một lần là cả CV lẫn đơn xin việc cùng cập nhật |
| `main.tex` | Tài liệu CV |
| `don-xin-viec.tex` | Tài liệu Đơn xin việc — **có 4 chỗ đánh dấu `[SỬA CHO TỪNG CÔNG TY]`** |
| `cv/muc-tieu.tex` | Mục tiêu nghề nghiệp |
| `cv/kinh-nghiem.tex` | Kinh nghiệm làm việc |
| `cv/hoc-van.tex` | Học vấn |
| `cv/chung-chi.tex` | Chứng chỉ & pháp lý hành nghề |
| `cv/ky-nang.tex` | Kỹ năng |
| `cv/thong-tin-them.tex` | Thời gian bắt đầu, ca làm việc, người tham chiếu |
| `awesome-cv.cls` | Lớp trình bày Awesome-CV (đã sửa nhẹ, xem cuối trang) |
| `avatar.jpg` | Ảnh chân dung, nền trắng — dùng cho CV |
| `avatar-nen-xanh-duong.jpg` | Ảnh thẻ nền xanh dương gốc |
| `Makefile` | Lệnh biên dịch nhanh |
| `LICENSE-template.txt` | Giấy phép CC BY-SA 4.0 của mẫu gốc |

## Cách biên dịch

CV dùng font OpenType nên **bắt buộc dùng XeLaTeX**, không dùng pdfLaTeX.

### Cách 1 — Overleaf (dễ nhất, không cần cài gì)

1. Tải cả thư mục `cv/` lên [Overleaf](https://www.overleaf.com/) dưới dạng dự án mới.
2. Vào **Menu → Compiler** → chọn **XeLaTeX**.
3. Chọn `main.tex` làm *Main document* rồi bấm **Recompile** để ra CV.
4. Đổi *Main document* sang `don-xin-viec.tex` rồi **Recompile** để ra đơn xin việc.

### Cách 2 — Máy cá nhân

```bash
cd cv
make            # tạo cả CV_VoVuongKhanhVy.pdf và DonXinViec_VoVuongKhanhVy.pdf
make cv         # chỉ dựng CV
make letter     # chỉ dựng đơn xin việc
make clean      # xoá các tệp trung gian
```

Yêu cầu: TeX Live/MiKTeX có `fontspec`, `unicode-math`, `fontawesome6`, `tcolorbox`,
`xifthen`, `ifmtarg`, `xstring`, `setspace`, `parskip`, cùng font **Source Sans 3**
(hoặc **Source Sans Pro** đi kèm TeX Live) và **Roboto**.

Trên Ubuntu/Debian:

```bash
sudo apt install texlive-xetex texlive-latex-extra texlive-fonts-extra \
                 fonts-roboto-unhinted
```

## Cách chỉnh sửa nội dung

### Đổi vị trí ứng tuyển

Trong `cauhinh.tex` sửa dòng chức danh (áp dụng cho cả 2 tài liệu):

```latex
\position{Dược sĩ Cao đẳng~~·~~Dược sĩ tư vấn}
```

rồi sửa dòng chân trang trong `main.tex` và câu cuối trong `cv/muc-tieu.tex`.

### Sửa đơn xin việc cho từng công ty (bắt buộc)

Đơn xin việc **luôn phải viết riêng cho từng nơi nộp** — gửi đơn ghi sai tên công ty
là bị loại ngay. Trong `don-xin-viec.tex` có 4 chỗ được đánh dấu
`[SỬA CHO TỪNG CÔNG TY]`:

| # | Chỗ cần sửa |
| --- | --- |
| 1 | `\recipient` — bộ phận và địa chỉ nơi nhận |
| 2 | `\lettertitle` — tên vị trí ứng tuyển |
| 3 | Tiêu đề mục *"Vì sao tôi chọn…"* và lý do chọn công ty đó |
| 4 | Câu kết nhắc lại tên công ty |

Bản đang có trong repo viết cho **Hệ thống Nhà thuốc Trung Sơn**.

### Đổi màu chủ đạo

Trong `cauhinh.tex`:

```latex
\definecolor{awesome}{HTML}{00796B}   % xanh y tế (mặc định)
```

Hoặc dùng màu có sẵn của Awesome-CV: `awesome-emerald`, `awesome-skyblue`,
`awesome-red`, `awesome-pink`, `awesome-orange`, `awesome-nephritis`,
`awesome-concrete`, `awesome-darknight` — bằng `\colorlet{awesome}{awesome-emerald}`.

Đổi ở đây thì **cả CV lẫn đơn xin việc** cùng đổi màu.

### Thay ảnh chân dung

Đặt ảnh **vuông** (tỷ lệ 1:1), nền trắng, tên `avatar.jpg` vào thư mục này.
Ảnh sẽ tự được cắt tròn. Muốn ảnh vuông thay vì tròn thì sửa trong `cauhinh.tex`:

```latex
\photo[rectangle,edge,left]{./avatar}
```

## Nguồn mẫu & những chỗ đã sửa

Mẫu gốc: [Awesome-CV](https://github.com/posquit0/Awesome-CV) của Claud D. Park
(posquit0) — giấy phép CC BY-SA 4.0, xem `LICENSE-template.txt`.

`awesome-cv.cls` được sửa 2 chỗ, đều có ghi chú `%%% SỬA ĐỔI %%%` trong tệp:

1. **Font dự phòng.** Bản gốc bắt buộc phải có font `Source Sans 3`, không có thì
   biên dịch dừng. Nay tự động lùi về `Source Sans Pro` (đi kèm sẵn TeX Live, cùng
   thiết kế, cũng đủ dấu tiếng Việt). Tương tự với `Roboto`.

Ngoài ra `cauhinh.tex` và `don-xin-viec.tex` ghi đè các thiết lập sau mà **không**
sửa tệp lớp:

2. **Màu tiêu đề mục.** Bản gốc tô màu 3 *ký tự* đầu của tiêu đề
   (`\StrSplit{...}{3}`). Với tiếng Việt, cách này cắt ngang giữa từ
   (`Kin|h nghiệm`, `Chứ|ng chỉ`) trông như lỗi hiển thị, nên ở đây tô màu toàn bộ
   tiêu đề.
3. **Chữ small-caps.** Font không có glyph small-caps cho chữ tiếng Việt có dấu
   (ư, ĩ, ẳ, ơ…) nên chúng rơi về chữ thường, làm dòng chữ cao thấp không đều. Thay
   `\scshape` bằng `\MakeUppercase` ở dòng chức danh, chân trang và tên vị trí.
4. **Khoảng cách giữa các mục** được thu gọn (`\acvSectionTopSkip`,
   `\acvSectionContentTopSkip`) để mỗi tài liệu vừa đúng một trang.
5. Trong `don-xin-viec.tex`: bỏ câu trích dẫn ở đầu trang và thu khoảng trống ký tên
   từ 3 dòng xuống 2 dòng, để lá đơn vừa một trang.
