# CV LaTeX — Võ Vương Khánh Vy (Dược sĩ Cao đẳng)

CV một trang, dùng để ứng tuyển vị trí **Dược sĩ tư vấn / nhân viên nhà thuốc**
tại TP. Cần Thơ.

📄 Bản PDF đã biên dịch sẵn: **[`CV_VoVuongKhanhVy.pdf`](CV_VoVuongKhanhVy.pdf)**
📝 Hướng dẫn nộp hồ sơ: **[`HUONG-DAN-UNG-TUYEN.md`](HUONG-DAN-UNG-TUYEN.md)**

## Nội dung thư mục

| Tệp | Mô tả |
| --- | --- |
| `main.tex` | Thông tin cá nhân, màu sắc, ảnh — **sửa vị trí ứng tuyển ở đây** |
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
3. Chọn `main.tex` làm *Main document* rồi bấm **Recompile**.

### Cách 2 — Máy cá nhân

```bash
cd cv
make            # tạo ra CV_VoVuongKhanhVy.pdf
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

Trong `main.tex`, sửa hai dòng:

```latex
\position{Dược sĩ Cao đẳng{\enskip\cdotp\enskip}Dược sĩ tư vấn}
...
{Võ Vương Khánh Vy~~~·~~~CV ứng tuyển Dược sĩ tư vấn}   % dòng chân trang
```

và câu cuối trong `cv/muc-tieu.tex`.

### Đổi màu chủ đạo

Trong `main.tex`:

```latex
\definecolor{awesome}{HTML}{00796B}   % xanh y tế (mặc định)
```

Hoặc dùng màu có sẵn của Awesome-CV: `awesome-emerald`, `awesome-skyblue`,
`awesome-red`, `awesome-pink`, `awesome-orange`, `awesome-nephritis`,
`awesome-concrete`, `awesome-darknight` — bằng `\colorlet{awesome}{awesome-emerald}`.

### Thay ảnh chân dung

Đặt ảnh **vuông** (tỷ lệ 1:1), nền trắng, tên `avatar.jpg` vào thư mục này.
Ảnh sẽ tự được cắt tròn. Muốn ảnh vuông thay vì tròn thì sửa trong `main.tex`:

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

Ngoài ra `main.tex` ghi đè 2 thiết lập mà **không** sửa tệp lớp:

2. **Màu tiêu đề mục.** Bản gốc tô màu 3 *ký tự* đầu của tiêu đề
   (`\StrSplit{...}{3}`). Với tiếng Việt, cách này cắt ngang giữa từ
   (`Kin|h nghiệm`, `Chứ|ng chỉ`) trông như lỗi hiển thị, nên ở đây tô màu toàn bộ
   tiêu đề.
3. **Khoảng cách giữa các mục** được thu gọn (`\acvSectionTopSkip`,
   `\acvSectionContentTopSkip`) để CV vừa đúng một trang.
