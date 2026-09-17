const PRODUCTS=[
 {id:"eve",name:"Eve",price:15000,category:"Dresses",img:"editorial.png",popular:true,new:true,sold:false,custom:true},
 {id:"flora",name:"Flora",price:15000,category:"Dresses",img:"hero.png",popular:true,new:true,sold:false,custom:true},
 {id:"aurora",name:"Aurora",price:15000,category:"Dresses",img:"argentina-lookbook.png",popular:true,new:true,sold:false,custom:false},
 {id:"stripe-skirt",name:"The Stripe Mini",price:8500,category:"Skirt Sets",img:"stripe-lookbook.png",popular:false,new:true,sold:false,custom:false},
 {id:"eden-set",name:"Eden Set",price:12000,category:"Skirt Sets",img:"editorial.png",popular:false,new:false,sold:false,custom:true},
 {id:"summer-short-set",name:"Summer Short Set",price:12000,category:"Short Sets",img:"hero.png",popular:false,new:false,sold:true,custom:false}
];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let bag=JSON.parse(localStorage.getItem("amea_bag")||"[]"), fav=JSON.parse(localStorage.getItem("amea_fav")||"[]");
let current=null,selectedSize="",shopCategory="All";
const format=n=>"JMD $"+Number(n).toLocaleString("en-US");
const card=p=>`<article class="product-card" onclick="openProduct('${p.id}')"><div class="product-photo"><img src="${p.img}" alt="${p.name}">${p.sold?'<span class="sold">SOLD OUT</span>':""}</div><div class="card-info"><div class="card-name">${p.name}</div><div class="card-price">${format(p.price)}</div></div></article>`;
function save(){localStorage.setItem("amea_bag",JSON.stringify(bag));localStorage.setItem("amea_fav",JSON.stringify(fav));updateCounts()}
function updateCounts(){$("#bagCount").textContent=bag.length;$("#favCount").textContent=fav.length}
function toast(t){let x=$("#toast");x.textContent=t;x.classList.add("show");clearTimeout(window._tt);window._tt=setTimeout(()=>x.classList.remove("show"),2200)}
function openLayer(el){closeLayers();el.classList.add("open");el.setAttribute("aria-hidden","false");$("#scrim").classList.add("show");document.body.classList.add("lock")}
function closeLayers(){$$(".drawer,.side-panel").forEach(x=>{x.classList.remove("open");x.setAttribute("aria-hidden","true")});$("#scrim").classList.remove("show");document.body.classList.remove("lock")}
$("#menuBtn").onclick=()=>openLayer($("#drawer"));$("#searchBtn").onclick=()=>openLayer($("#searchPanel"));$("#favBtn").onclick=()=>{renderFavorites();openLayer($("#favPanel"))};$("#bagBtn").onclick=()=>{renderBag();openLayer($("#bagPanel"))};$("#scrim").onclick=closeLayers;$$("[data-close]").forEach(x=>x.onclick=closeLayers);
addEventListener("scroll",()=>$("#nav").classList.toggle("scrolled",scrollY>40));
$("#popularGrid").innerHTML=PRODUCTS.filter(x=>x.popular).slice(0,3).map(card).join("");
$("#arrivalRow").innerHTML=PRODUCTS.filter(x=>x.new).map(card).join("");
function renderShop(){let cats=["All","Dresses","Skirt Sets","Short Sets","Collection"];$("#filters").innerHTML=cats.map(c=>`<button class="${shopCategory===c?"active":""}" onclick="setCategory('${c}')">${c}</button>`).join("");let list=shopCategory==="All"||shopCategory==="Collection"?PRODUCTS:PRODUCTS.filter(x=>x.category===shopCategory);$("#shopTitle").textContent=shopCategory==="All"?"All Pieces":shopCategory;$("#shopGrid").innerHTML=list.map(card).join("")}
function showShop(){location.hash="shop";$("#nav").classList.add("shop-nav");$("#home").style.display="none";$("#shopPage").classList.add("show");$("#shopPage").setAttribute("aria-hidden","false");window.scrollTo(0,0);renderShop()}
function hideShop(){$("#nav").classList.remove("shop-nav");$("#shopPage").classList.remove("show");$("#shopPage").setAttribute("aria-hidden","true");$("#home").style.display="block";location.hash="home";window.scrollTo(0,0)}
function setCategory(c){shopCategory=c;showShop()}
$$(".drawer a[data-category]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();closeLayers();setCategory(a.dataset.category)}));
addEventListener("hashchange",()=>{if(location.hash==="#shop")showShop()});
function openProduct(id){current=PRODUCTS.find(x=>x.id===id);if(!current)return;selectedSize="";$("#productImage").src=current.img;$("#productName").textContent=current.name;$("#productPrice").textContent=format(current.price);$("#productCategory").textContent=current.category.toUpperCase();$("#sizes").innerHTML=["XS","S","M","L","XL"].map(s=>`<button onclick="chooseSize('${s}',this)">${s}</button>`).join("");$("#customBlock").style.display=current.custom?"block":"none";$("#productFavorite").textContent=(fav.includes(id)?"♥ Remove from Favorites":"♡ Add to Favorites");$("#addToBag").style.display=current.sold?"none":"block";$("#notifyButton").style.display=current.sold?"block":"none";$("#productModal").classList.add("show");$("#productModal").setAttribute("aria-hidden","false");document.body.classList.add("lock")}
function closeModal(){$("#productModal").classList.remove("show");$("#productModal").setAttribute("aria-hidden","true");$("#productImage").classList.remove("zoom");document.body.classList.remove("lock")}
$$("[data-close-modal]").forEach(x=>x.onclick=closeModal);$("#productModal").addEventListener("click",e=>{if(e.target===$("#productModal"))closeModal()});
function chooseSize(s,b){selectedSize=s;$$(".sizes button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected")}
$("#productImage").onclick=()=>$("#productImage").classList.toggle("zoom");
$("#productFavorite").onclick=()=>{if(!current)return;fav=fav.includes(current.id)?fav.filter(x=>x!==current.id):[...fav,current.id];save();$("#productFavorite").textContent=(fav.includes(current.id)?"♥ Remove from Favorites":"♡ Add to Favorites");toast(fav.includes(current.id)?"Saved to favorites ♡":"Removed from favorites")}
$("#addToBag").onclick=()=>{if(!selectedSize)return toast("Please choose a size first");let item={id:crypto.randomUUID(),productId:current.id,name:current.name,price:current.price,img:current.img,size:selectedSize,custom:current.custom?$("#customPreset").value:"",request:current.custom?$("#customRequest").value:""};bag.push(item);save();closeModal();toast("Added to your bag ♡")}
$("#notifyButton").onclick=()=>{let email=prompt("Email address for restock notification:");if(email)toast("Restock request saved on this device — backend email delivery still needs connection")}
$("#sizeGuideBtn").onclick=()=>$("#sizeModal").classList.add("show");$$("[data-close-info]").forEach(x=>x.onclick=()=>x.closest(".modal").classList.remove("show"));
function renderFavorites(){let list=fav.map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean);$("#favItems").innerHTML=list.length?list.map(p=>`<div class="mini-item"><img src="${p.img}" alt=""><div onclick="closeLayers();openProduct('${p.id}')"><h4>${p.name}</h4><p>${format(p.price)}</p></div><button onclick="removeFav('${p.id}')">×</button></div>`).join(""):'<div class="empty">Your favorites are empty.</div>'}
function removeFav(id){fav=fav.filter(x=>x!==id);save();renderFavorites()}
function renderBag(){let total=bag.reduce((s,x)=>s+x.price,0);$("#bagItems").innerHTML=bag.length?bag.map(x=>`<div class="mini-item"><img src="${x.img}" alt=""><div><h4>${x.name}</h4><p>Size ${x.size} · ${format(x.price)}</p></div><button onclick="removeBag('${x.id}')">×</button></div>`).join("")+`<div style="display:flex;justify-content:space-between;padding-top:20px"><b>Total</b><b>${format(total)}</b></div><button class="checkout" onclick="checkout()">CHECKOUT</button>`:'<div class="empty">Your bag is currently empty.</div>'}
function removeBag(id){bag=bag.filter(x=>x.id!==id);save();renderBag()}
function checkout(){closeLayers();$("#accountModal").classList.add("show")}
$("#searchInput").oninput=e=>{let q=e.target.value.trim().toLowerCase();let list=q?PRODUCTS.filter(p=>(p.name+" "+p.category).toLowerCase().includes(q)):[];$("#searchResults").innerHTML=q?(list.length?list.map(p=>`<div class="mini-item" onclick="closeLayers();openProduct('${p.id}')"><img src="${p.img}"><div><h4>${p.name}</h4><p>${p.category} · ${format(p.price)}</p></div></div>`).join(""):'<div class="empty">No pieces found.</div>'):'<div class="empty">Start typing to search.</div>'}
$("#newsletterForm").onsubmit=e=>{e.preventDefault();toast("Welcome to the Améa babes ♡");e.target.reset()}
function openInfo(which){toast("About page structure is ready for your final brand story")}
updateCounts();renderShop();