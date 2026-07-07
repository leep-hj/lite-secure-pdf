import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.mjs";

export default class PdfViewer {
  constructor({element, url}) {
    this.root = element;
    this.url = url;
    this.scale = 1;
    this.page = 1;
    this.pdf = null;

    this.root.classList.add("pdfv");

    this.root.innerHTML = `
      <div class="pdfv-toolbar">
        <div class="pdfv-left">
          <button class="pdfv-out">-</button>
          <span class="pdfv-zoom">100%</span>
          <button class="pdfv-in">+</button>
        </div>
        <div class="pdfv-title"></div>
        <div class="pdfv-right">
          <button class="pdfv-prev">&lt;</button>
          <span class="pdfv-page">1/1</span>
          <button class="pdfv-next">&gt;</button>
        </div>
      </div>
      <div class="pdfv-body">
        <canvas></canvas>
      </div>
    `;

    this.canvas=this.root.querySelector("canvas");
    this.ctx=this.canvas.getContext("2d");
    this.zoomEl=this.root.querySelector(".pdfv-zoom");
    this.pageEl=this.root.querySelector(".pdfv-page");
    this.titleEl=this.root.querySelector(".pdfv-title");

    const name=(url.split("?")[0].split("/").pop())||"";
    this.titleEl.textContent=decodeURIComponent(name);

    this.root.querySelector(".pdfv-in").onclick=()=>this.zoomAt(this.scale+.2);
    this.root.querySelector(".pdfv-out").onclick=()=>this.zoomAt(Math.max(.5,this.scale-.2));
    this.root.querySelector(".pdfv-prev").onclick=()=>this.prevPage();
    this.root.querySelector(".pdfv-next").onclick=()=>this.nextPage();
    this.canvas.addEventListener("dblclick", async (e)=>{const newScale = this.scale === 1 ? 2 : 1;this.zoomAt(newScale, e.clientX, e.clientY);});

    this.body = this.root.querySelector(".pdfv-body");
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let startScrollTop = 0;
    this.body.addEventListener("mousedown", (e) => {
        dragging = true;
        this.body.style.cursor = "grabbing";
        startX = e.clientX;
        startY = e.clientY;
        startScrollLeft = this.body.scrollLeft;
        startScrollTop = this.body.scrollTop;
        e.preventDefault();
    });
    window.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        this.body.scrollLeft = startScrollLeft - (e.clientX - startX);
        this.body.scrollTop = startScrollTop - (e.clientY - startY);
    });
    window.addEventListener("mouseup", () => {
        if (!dragging) return;
        dragging = false;
        this.body.style.cursor = "grab";
    });

    this.body.addEventListener("contextmenu", (e) => e.preventDefault());
    this.canvas.addEventListener("dragstart", (e) => e.preventDefault());
    // window.addEventListener("keydown", (e) => { if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) { e.preventDefault(); }});

    this.load();
  }

  async load(){
    this.pdf=await pdfjsLib.getDocument(this.url).promise;
    await this.render();
  }

  async render(){
    const p=await this.pdf.getPage(this.page);
    const vp=p.getViewport({scale:this.scale});
    this.canvas.width=vp.width;
    this.canvas.height=vp.height;
    await p.render({canvasContext:this.ctx,viewport:vp}).promise;
    this.zoomEl.textContent=`${Math.round(this.scale*100)}%`;
    this.pageEl.textContent=`${this.page} / ${this.pdf.numPages}`;
  }

  async zoomAt(targetScale, clientX, clientY) {
    const oldScale = this.scale;
    const newScale = Math.min(5, Math.max(0.5, targetScale)); 
    if (oldScale === newScale) return;
    const ratio = newScale / oldScale;
    let targetX = clientX;
    let targetY = clientY;
    if (targetX === undefined || targetY === undefined) {
      const bodyRect = this.body.getBoundingClientRect();
      targetX = bodyRect.left + bodyRect.width / 2;
      targetY = bodyRect.top + bodyRect.height / 2;
    }
    const oldCanvasRect = this.canvas.getBoundingClientRect();
    const canvasX = targetX - oldCanvasRect.left;
    const canvasY = targetY - oldCanvasRect.top;
    await this.setScale(newScale);
    const newCanvasRect = this.canvas.getBoundingClientRect();
    this.body.scrollLeft += (newCanvasRect.left + (canvasX * ratio)) - targetX;
    this.body.scrollTop += (newCanvasRect.top + (canvasY * ratio)) - targetY;
  }

  async setScale(v){
    this.scale=Math.min(5,Math.max(.5,v));
    if(this.pdf) await this.render();
  }
  async nextPage(){
    if(this.page<this.pdf.numPages){this.page++;await this.render();}
  }
  async prevPage(){
    if(this.page>1){this.page--;await this.render();}
  }
  async setPage(p){
    if(p>=1&&p<=this.pdf.numPages){this.page=p;await this.render();}
  }
  destroy(){
    this.root.innerHTML="";
  }
}
