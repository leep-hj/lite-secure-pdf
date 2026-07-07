# lite-secure-pdf

A lightweight, zero-dependency, vanilla JavaScript PDF viewer featuring client-side download restrictions, smart double-click zooming, and pointer-tracking adjustments.

This project provides a clean and highly customizable base for developers who need to display PDFs on the web while preventing easy/casual downloading by ordinary users.

## ✨ Features

- **Vanilla JavaScript**: Pure JS implementation without heavy frameworks (React, Vue, Angular, etc.).
- **Smart Zooming & Focusing**: 
  - Double-clicking zooms into the **exact mouse pointer location** without losing track.
  - Toolbar `+` / `-` buttons zoom into the **center of the current viewport**.
- **Client-Side Restrictions (Basic Protection)**:
  - Disables right-click context menu (`contextmenu`) on the viewer to block "Save image as...".
  - Prevents drag-and-drop of the canvas elements to the desktop.
- **Smooth Navigation**: Supports grab-and-drag panning when zoomed in.

## 🚀 Getting Started

### Prerequisites

This viewer uses **PDF.js** (by Mozilla) via CDN. Ensure you have an active internet connection or host the PDF.js library locally.

### Installation & Usage

1. Copy the `pdf-viewer/` directory (containing `pdf-viewer.js` and `pdf-viewer.css`) into your project.
2. Link the stylesheet and import the module as shown below:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secured PDF Viewer Example</title>
    <link rel="stylesheet" href="./pdf-viewer/pdf-viewer.css">
</head>
<body>

    <div id="pdfViewer" style="height: 800px;"></div>

    <script type="module">
        import PdfViewer from "./pdf-viewer/pdf-viewer.js";

        new PdfViewer({
            element: document.getElementById("pdfViewer"),
            url: "./your_sample_document.pdf"
        });
    </script>
</body>
</html>
```


## 🔒 Security Disclaimer (Important)
Please note that complete client-side security on the web is impossible.

What this viewer does: It prevents casual users from easily right-clicking or dragging to download the PDF pages as images.

What this viewer cannot block: Advanced users or developers can still inspect the browser's Network Tab (F12) to find the original PDF source URL or take screenshots.

## 💡 Recommendation for Enhanced Security
If you require ironclad security:

Do not expose the direct URL of the PDF file. Serve the file through a backend authenticated stream.

Consider converting PDF pages into images on the server side and loading them sequentially into this canvas viewer.

## 📜 License
This project is licensed under the MIT License.

