# Biên dịch CV và Đơn xin việc bằng XeLaTeX (bắt buộc — Awesome-CV dùng fontspec/OpenType)
CV     := CV_VoVuongKhanhVy.pdf
LETTER := DonXinViec_VoVuongKhanhVy.pdf
COMMON := awesome-cv.cls cauhinh.tex avatar.jpg

.PHONY: all cv letter clean distclean

all: $(CV) $(LETTER)

cv: $(CV)
letter: $(LETTER)

$(CV): main.tex $(COMMON) $(wildcard cv/*.tex)
	xelatex -interaction=nonstopmode -jobname=$(basename $(CV)) main.tex
	xelatex -interaction=nonstopmode -jobname=$(basename $(CV)) main.tex

$(LETTER): don-xin-viec.tex $(COMMON)
	xelatex -interaction=nonstopmode -jobname=$(basename $(LETTER)) don-xin-viec.tex
	xelatex -interaction=nonstopmode -jobname=$(basename $(LETTER)) don-xin-viec.tex

clean:
	rm -f *.aux *.log *.out *.fls *.fdb_latexmk *.synctex.gz missfont.log

distclean: clean
	rm -f $(CV) $(LETTER)
