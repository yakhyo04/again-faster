
let cartWrapper = document.querySelector('.cart__wrapper');
let headerCart = document.querySelector('.header__cart');
let cartClose = document.querySelector('.cart__close');
let divWrapper = document.querySelector('.item__divwrapper');
let cartDivWrapper = document.querySelector('.cart__div--wrapper');
let cartFooter = document.querySelector('.cart__footer');
let cartTotal = document.querySelector('.cart__totalprice');
const productItem = document.querySelectorAll('.product__item--link');

// headerCart.addEventListener('click', function(e){
//     cartWrapper.style.display = 'block'
// })
// cartClose.addEventListener('click', function(e){
//     cartWrapper.style.display = 'none'
// })

// const query = gql`
//     query ProductIdAndTitle($id: ID!){
//         product(id: $id){
//             id
//             title
//         }
//     }
// `

// const variables = {
//     id: "gid://shopify/Product/7361659994305"
// } 



form.addEventListener('submit', async (e) => {
    let variant_id = document.querySelector('.variant-radio:checked');
    e.preventDefault()
    if(e.target.dataset.id >= 1){
        let recharge_id = form.querySelector(".recharge-option:checked").value
        if(recharge_id == "subscribe"){
            let recharge_freq_id = form.querySelector(".recharge-frequency-option:checked").value
            let recharge_prod_id = form.querySelector(".recharge-frequency-option:checked").id
            addToCartWithSellingPlans(recharge_prod_id, 1, recharge_freq_id)
        }else{
            changeCart(recharge_id, 1)
        }
        console.log(recharge_id);
    }
    // cartWrapper.style.display = 'block'
    let formData = {
        'items': [{
                'id': variant_id.value,
                'quantity': 1
            }]
    };
        
    await fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        headers: {
            'dataType': 'json',
            'Content-Type': 'application/json'
    },
        body: JSON.stringify(formData)
    }).then((response) => {
            renderCartItems();
            return response.json()
    })
        .catch((error) => {
            console.error('Error:', error);
    });
})

let cartDiv = document.querySelector('.cart__div');  


async function renderCartItems() {
    let response = await fetch(window.Shopify.routes.root + 'cart.js');
    let data = await response.json();
    

    formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
    }); 
    
      cartDiv.innerHTML = ''; 
      let template = '';
    // await fetch('/cart.js').then(res => res.json()).then(data => data.items.map(item => {
    // template += `
    //     <div class="item__divwrapper" id="${item.variant_id}">
    //     <div class="item__div">
    //     <img class="item__image" src="${item.image}" alt="" />
    //     </div>
    //     <div class="item__div2">
    //     <h3>${item.product_title}</h3>
    //     <h4>${item.variant_title ? item.variant_title : ''}</h4>
    //     <nav class="item__nav">
    //     <button class="item__btn item__minus minus" id="minus">-</button>
    //     <p class="item__count">${item.quantity}</p>
    //     <button class="item__btn item__plus plus" id="plus">+</button>
    //     </nav>
    //     </div>
    //     <div class="item__div3">
    //     <p>${this.formatter.format(item.final_price / 100)}</p>
    //     <p class="item__close" id="remove_product">x</p>
    //     </div>
    //     </div>
    //     `
    //     cartTotal.innerText = this.formatter.format(data.original_total_price / 100) 

    //     // cartDiv.insertAdjacentHTML('beforeend', template);
        
    // }))
    
    data.items.forEach((item) => {
        let deliver_frequency = item?.selling_plan_allocation?.selling_plan.name
        template += `
        <div class="item__divwrapper" id="${item.key}">
        <div class="item__div">
        <img class="item__image" src="${item.image}" alt="" />
        </div>
        <div class="item__div2">
        <h3>${item.product_title}</h3>
        <p id="variant_title">${ deliver_frequency != null ? deliver_frequency : "" }</p>
        <h4>${item.variant_title ? item.variant_title : ''}</h4>
        <nav class="item__nav">
        <button class="item__btn item__minus minus" id="minus">-</button>
        <p class="item__count">${item.quantity}</p>
        <button class="item__btn item__plus plus" id="plus">+</button>
        </nav>
        </div>
        <div class="item__div3">
        <p>${this.formatter.format(item.final_price / 100)}</p>
        <p class="item__close" id="remove_product">x</p>
        </div>
        </div>
        `
        cartTotal.innerText = this.formatter.format(data.original_total_price / 100) 
    })
    if(template.length > 0){
        cartDiv
        cartFooter.style.display = 'block'
        cartDivWrapper.style.display = 'none'
    }else if(template.length == 0){
        cartFooter.style.display = 'none'
        cartDivWrapper.style.display = 'block'
    }
    cartDiv.insertAdjacentHTML('beforeend', template);
}

renderCartItems();


function addToCartWithSellingPlans(id, qtty, dataId){
    let form_data = {
        items: [
            {
                id: id,
                quantity: qtty,
                selling_plan: dataId
            },
        ],
    };
    fetch(window.Shopify.routes.root + "cart/add.js", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(form_data),
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
        this.renderCartItems();
    })
    .catch((error) => {
        console.error("Error: ", error)
    })
}


for(let i = 0; i < productItem.length; i++) {
    const productItems = productItem[i]
    productItems.addEventListener('click',function(e){
        e.preventDefault()
        // cartWrapper.style.display = 'block'
        const variantId = productItems.dataset.id
        const formData = {
            items: [{
                id: variantId,
                quantity: 1
            }]
        }
            fetch(window.Shopify.routes.root + 'cart/add.js', {
                method: 'POST',
                headers: {
                    'dataType': 'json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            }).then((response) => {
                renderCartItems();
                    return response.json()
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
    })
}

function changeCart(id, qty){
    let form_data = {
        id: id,
        quantity: qty
    };
    fetch(window.Shopify.routes.root + "cart/change.js", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(form_data),
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        renderCartItems();
    })
    .catch((error) => {
        console.error("Error: ", error)
    })
}

cartDiv?.addEventListener('click', (e) => {
    if( e.path[3].id == e.target.parentElement.parentElement.parentElement.id && e.target.id == "minus" ){
        changeCart( e.path[3].id, Number(e.target.nextElementSibling.textContent) - 1 );
    }
    else if( e.path[3].id == e.target.parentElement.parentElement.parentElement.id && e.target.id == "plus" ){
        changeCart( e.path[3].id, Number(e.target.previousElementSibling.textContent) + 1 );
    }else if(e.path[2].id == e.target.parentElement.parentElement.id && e.target.id == "remove_product"){
        changeCart(e.path[2].id, 0)
    }

})

const rechargeChecked = document.querySelector('.recharge__checked');
const rechargeFLabel = document.querySelector('.recharge-frequency');
const rechargeOneTime = document.querySelector('.recharge__onetime');

rechargeOneTime.addEventListener('click', (e) => {
    rechargeFLabel.style.display = 'none';
})

rechargeChecked.addEventListener('click', (e) => {
    rechargeFLabel.style.display = 'block';
})