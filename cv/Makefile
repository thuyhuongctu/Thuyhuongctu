# Biên dịch CV bằng XeLaTeX (bắt buộc — Awesome-CV dùng fontspec/OpenType)
PDF  := CV_VoVuongKhanhVy.pdf
SRC  := main.tex awesome-cv.cls avatar.jpg $(wildcard cv/*.tex)

.PHONY: all clean distclean

all: $(PDF)

$(PDF): $(SRC)
	xelatex -interaction=nonstopmode -jobname=$(basename $(PDF)) main.tex
	xelatex -interaction=nonstopmode -jobname=$(basename $(PDF)) main.tex

clean:
	rm -f *.aux *.log *.out *.fls *.fdb_latexmk *.synctex.gz missfont.log

distclean: clean
	rm -f $(PDF)
