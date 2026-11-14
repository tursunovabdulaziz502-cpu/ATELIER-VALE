const tugmalar = document.querySelectorAll('.filter-btn');
const kartochkalar = document.querySelectorAll('.product-card');

tugmalar.forEach(tugma => {
    
    tugma.onclick = function(){
        document.querySelector('.filter-btn.active').classList.remove('active');
        tugma.classList.add('active');

        let tanlanganTur = tugma.getAttribute('data-filter');
        
        kartochkalar.forEach(karta =>{
            
            let kartaTuri = karta.getAttribute('data-category');

            if(tanlanganTur === 'all' || tanlanganTur === kartaTuri){
                karta.style.display = 'block';
            } else {
                karta.style.display = 'none';
            }

        });
    };
});

(function () {
  var form = document.querySelector(".news-form");
  var input = document.querySelector(".news-input");
  var toast = document.querySelector(".news-toast");
  var icon = toast.querySelector(".news-toast-icon");
  var title = toast.querySelector(".news-toast-title");
  var text = toast.querySelector(".news-toast-text");
  var closeBtn = toast.querySelector(".news-toast-close");
  var timer = null;

  function showToast(type, heading, message) {
    clearTimeout(timer);
    toast.classList.remove("success", "error");
    toast.classList.add(type, "show");
    icon.textContent = type === "success" ? "✓" : "!";
    title.textContent = heading;
    text.textContent = message;
    timer = setTimeout(hideToast, 4500);
  }

  function hideToast() {
    toast.classList.remove("show");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = input.value.trim();
    var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    if (email === "") {
      showToast("error", "Email required", "Please enter your email address.");
      input.focus();
      return;
    }

    if (!valid) {
      showToast("error", "Invalid email", "Please check your email address and try again.");
      input.focus();
      return;
    }

    showToast("success", "Thank you!", email + " has been added to our list. Check your inbox soon.");
    form.reset();
  });

  closeBtn.addEventListener("click", hideToast);
})();

const $ = (s, r = document) => r.querySelector(s), $$ = (s) => document.querySelectorAll(s);
const money = (n) => '$' + n.toLocaleString('en-US');
let cart = JSON.parse(localStorage.getItem('cart')) || [], timer;

document.head.insertAdjacentHTML('beforeend', `<style>
.icon i{cursor:pointer} .cart-wrap{position:relative}
#cart-count{position:absolute;top:-9px;right:-11px;background:#1a1a1a;color:#fff;font:600 11px/18px sans-serif;min-width:18px;height:18px;border-radius:9px;text-align:center}
#overlay{position:fixed;inset:0;background:#0007;opacity:0;visibility:hidden;transition:.3s;z-index:1000}
#panel{position:fixed;top:0;right:0;height:100%;width:min(400px,100%);background:#fff;z-index:1001;display:flex;flex-direction:column;transform:translateX(100%);transition:.35s;box-shadow:-4px 0 24px #0003}
.cart-open #overlay{opacity:1;visibility:visible} .cart-open #panel{transform:none}
.top{display:flex;justify-content:space-between;align-items:center;padding:18px 24px;border-bottom:1px solid #eee} .top button{background:none;border:0;font-size:28px;cursor:pointer}
#items{flex:1;overflow:auto;padding:0 24px} .item{display:flex;gap:14px;padding:16px 0;border-bottom:1px solid #f0f0f0} .item img{width:80px;height:80px;object-fit:cover;border-radius:6px}
.item div{display:flex;flex-direction:column;gap:6px} .item .qty{flex-direction:row;align-items:center;gap:10px}
.qty button{width:28px;height:28px;border-radius:50%;border:1px solid #ccc;background:#fff;cursor:pointer} .rm{background:none;border:0;color:#c0392b;cursor:pointer;padding:0;text-align:left}
.bottom{padding:20px 24px;border-top:1px solid #eee} .total{display:flex;justify-content:space-between;font-size:18px;font-weight:700;margin-bottom:14px}
.bottom button{width:100%;padding:14px;background:#1a1a1a;color:#fff;border:0;border-radius:8px;font-size:16px;cursor:pointer}
#toast{position:fixed;left:50%;bottom:30px;z-index:2000;display:flex;align-items:center;gap:14px;min-width:300px;max-width:92vw;padding:14px 18px;background:#1a1a1a;color:#fff;border-radius:14px;box-shadow:0 12px 40px #0006;overflow:hidden;opacity:0;transform:translate(-50%,120px);transition:.45s cubic-bezier(.2,1.2,.4,1)}
#toast.show{opacity:1;transform:translate(-50%,0)} #toast i{width:36px;height:36px;border-radius:50%;background:#2ecc71;display:grid;place-items:center;font-style:normal;font-weight:700}
#toast p{flex:1;margin:0;font-size:13px;color:#bbb} #toast b{display:block;font-size:14px;color:#fff}
#toast button{background:#fff;border:0;border-radius:20px;padding:7px 14px;font-weight:600;cursor:pointer}
#toast u{position:absolute;left:0;bottom:0;height:3px;width:100%;background:#2ecc71;transform-origin:left} .show u{animation:line 2.5s linear forwards} @keyframes line{to{transform:scaleX(0)}}
</style>`);

// 2. Elementlar
document.body.insertAdjacentHTML('beforeend', `<div id="overlay"></div>
<aside id="panel"><div class="top"><h3>Your cart</h3><button id="close">&times;</button></div><div id="items"></div>
<div class="bottom"><div class="total"><span>Total</span><span id="total"></span></div><button onclick="alert('Checkout hali ulanmagan')">Checkout</button></div></aside>
<div id="toast"><i>✓</i><p><b>Added to cart</b><span id="tname"></span></p><button id="view">View cart</button><u></u></div>`);
$('.fa-cart-shopping').outerHTML = '<span class="cart-wrap"><i class="fa-solid fa-cart-shopping"></i><span id="cart-count">0</span></span>';

// 3. Savat
function draw() {
  let total = 0, count = 0;
  $('#items').innerHTML = cart.length ? cart.map((c, i) => {
    total += c.price * c.qty; count += c.qty;
    return `<div class="item"><img src="${c.img}"><div><b>${c.name}</b><span>${money(c.price * c.qty)}</span>
      <div class="qty"><button onclick="change(${i},-1)">−</button>${c.qty}<button onclick="change(${i},1)">+</button></div>
      <button class="rm" onclick="change(${i},-999)">Remove</button></div></div>`;
  }).join('') : '<p style="text-align:center;color:#888;margin-top:60px">Your cart is empty.</p>';
  $('#total').textContent = money(total); $('#cart-count').textContent = count;
  localStorage.setItem('cart', JSON.stringify(cart));
}
function change(i, d) { cart[i].qty += d; if (cart[i].qty <= 0) cart.splice(i, 1); draw(); }
function toast(name) {
  const t = $('#toast'); $('#tname').textContent = name;
  t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
  clearTimeout(timer); timer = setTimeout(() => t.classList.remove('show'), 2500);
}
$$('.product-card').forEach((card) => $('button', card).addEventListener('click', () => {
  const name = $('.thesora', card).textContent.trim(), old = cart.find((c) => c.name === name);
  if (old) old.qty++;
  else cart.push({ name, qty: 1, price: parseFloat($('.narx', card).textContent.replace(/[^0-9.]/g, '')), img: $('img', card).getAttribute('src') });
  draw(); toast(name);
}));
const toggleCart = (on) => document.body.classList.toggle('cart-open', on);
$('.cart-wrap').onclick = () => toggleCart(true);
$('#overlay').onclick = $('#close').onclick = () => toggleCart(false);
$('#view').onclick = () => { $('#toast').classList.remove('show'); toggleCart(true); };
document.onkeydown = (e) => e.key === 'Escape' && toggleCart(false);

draw();
