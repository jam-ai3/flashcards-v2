import pymupdf4llm
import fitz
import os


class PdfParser:
    def __init__(self, pdf_source):
        self.pdf_source = pdf_source
        self.doc = fitz.open(stream=self.pdf_source, filetype="pdf")

    # def get_chapters(self):
    #     """
    #     Get the chapters from the PDF file.
    #     """
    #     if self.get_chapter_from_toc():
    #         return self.chapters
    #     else:
    #         self.chapters = self.get_chapters_from_txt()
    #         return self.chapters

    # Vanilla text extraction

    def get_all_text_without_chapters(self):
        """
        Get all text from the PDF file without chapters.
        """
        # doc = fitz.open(stream = self.pdf_source, filetype = "pdf")
        text = ""
        for page in self.doc:
            text += page.get_text()
        return text

    # def get_chapter_from_toc(self):
    #     """
    #     Get the chapter from the table of contents.
    #     Returns True if chapters were found, False otherwise.
    #     """
    #     # doc = fitz.open(self.pdf_path)

    #     toc = self.doc.get_toc()
    #     if len(toc) == 0:
    #         self.doc.close()
    #         return False
    #     print(toc)

    #     # Get all level 1 chapters and their pages
    #     chapter_markers = []
    #     for level, title, page in toc:
    #         if level == 1:  # Only get main chapters (level 1)
    #             chapter_markers.append((title, page))

    #     if not chapter_markers:
    #         self.doc.close()
    #         return False

    #     # Process each chapter by reading all pages until the next chapter
    #     for i, (title, start_page) in enumerate(chapter_markers):
    #         # Get the end page (either next chapter's page - 1 or last page of document)
    #         end_page = chapter_markers[i + 1][1] - 1 if i < len(chapter_markers) - 1 else self.doc.page_count

    #         # Collect text from all pages in this chapter
    #         chapter_text = []
    #         for page_num in range(start_page - 1, end_page):  # -1 because pages are 1-based
    #             page = self.doc[page_num]
    #             text = page.get_text()
    #             chapter_text.append(text)

    #         # Combine all pages and add to chapters
    #         full_text = '\n'.join(chapter_text)
    #         if full_text.strip():  # Only add if there's actual content
    #             self.chapters.append({
    #                 'title': title,
    #                 'content': full_text,
    #                 'order': i + 1
    #             })

    #     self.doc.close()
    #     return len(self.chapters) > 0

    # def get_chapters_from_txt(self):
    #     """
    #     Extract chapters from PDF by converting to markdown and parsing the text.
    #     Returns a list of chapter dictionaries with title, content, and order.
    #     """
    #     # Removing very short chapters (assuming that they are not chapters, DANGER)
    #     MIN_CHAPTER_LENGTH = 50

    #     try:
    #         # Get markdown content
    #         md_text = pymupdf4llm.to_markdown(self.pdf_path, show_progress=True)
    #         # Remove underscores from markdown text, they are end page indicators
    #         md_text = md_text.replace('-', '')

    #         # Initialize variables for chapter extraction
    #         current_chapter = None
    #         current_text = []
    #         counter = 0

    #         # Process each line
    #         for line in md_text.split('\n'):
    #             if line.startswith('#'):
    #                 # If we found a new chapter, save the previous one
    #                 if current_chapter is not None and current_text:
    #                     chapter_text = ''.join(current_text)
    #                     if len(chapter_text.strip()) > MIN_CHAPTER_LENGTH:
    #                         self.chapters.append({
    #                             'title': current_chapter,
    #                             'content': chapter_text,
    #                             'order': counter
    #                         })

    #                 # Start new chapter
    #                 counter += 1
    #                 current_chapter = f"Chapter {counter}_{line.lstrip('#').strip()}"
    #                 current_text = []
    #             else:
    #                 if current_chapter is not None:
    #                     current_text.append(line + '\n')

    #         # Don't forget to save the last chapter
    #         if current_chapter is not None and current_text:
    #             chapter_text = ''.join(current_text)
    #             if len(chapter_text.strip()) > MIN_CHAPTER_LENGTH:
    #                 self.chapters.append({
    #                     'title': current_chapter,
    #                     'content': chapter_text,
    #                     'order': counter
    #                 })
    #         print(self.chapters)
    #         return self.chapters

    #     except Exception as e:
    #         print(f"Error processing PDF: {e}")
    #         return self.chapters


if __name__ == "__main__":
    curr_path = os.path.dirname(os.path.abspath(__file__))
    pdf_name = "../pdf2.pdf"
    pdf_path = os.path.join(curr_path, pdf_name)
    with open(pdf_path, "rb") as pdf_file:
        pdf_source = pdf_file.read()
    parser = PdfParser(pdf_source)
    print(parser.get_all_text_without_chapters())
