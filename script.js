
let cart = []
let modalqt = 1
modalkey = 0

const c = (el) => document.querySelector(el)
const cs = (el) => document.querySelectorAll(el)

pizzaJson.map((item, index) => {
    let pizzaItem = c('.pizza-item').cloneNode(true)

    // colocando o id na pizza

    pizzaItem.setAttribute('data-key', index)

    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name

    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description

    pizzaItem.querySelector('.pizza-item--price').innerHTML = item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    pizzaItem.querySelector('.pizza-item--img img').src = item.img

    // adicionando evento de click nas pizzas

    pizzaItem.querySelector('a').addEventListener("click", function (e) {

        e.preventDefault()
        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        modalqt = 1
        modalkey = key
        // prenchendo o modal
        c('.pizzaInfo--actualPrice').innerHTML = pizzaJson[key].price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        c('.pizzaBig img').src = pizzaJson[key].img
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description

        c('.pizzaInfo--size.selected ').classList.remove('selected')

        cs('.pizzaInfo--size').forEach(function (size, sizeIndex) {
            if (sizeIndex == 2) {
                size.classList.add('selected')
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        })

        c('.pizzaInfo--qt').innerHTML = modalqt


        c('.pizzaWindowArea').style.opacity = 0
        c('.pizzaWindowArea').style.display = 'flex'
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1
        }, 100);


    })

    let pizzaArea = c('.pizza-area').append(pizzaItem)
})


// eventos do modal

function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none'
    }, 500);

}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal)
})

c('.pizzaInfo--qtmenos').addEventListener('click', () => {

    if (modalqt > 1) {
        modalqt--
        c('.pizzaInfo--qt').innerHTML = modalqt
    }
})

c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalqt++
    c('.pizzaInfo--qt').innerHTML = modalqt
})

cs('.pizzaInfo--size').forEach((size, index) => {
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')
    })
})

// adicionando ao carrinho

c('.pizzaInfo--addButton').addEventListener('click', () => {

    let size = c('.pizzaInfo--size.selected').getAttribute('data-key')
    let identifier = pizzaJson[modalkey].id + '@' + size
    let key = cart.findIndex((item) => item.identifier == identifier)

    if (key > -1) {

        cart[key].qt += modalqt

    } else {

        cart.push({
            id: pizzaJson[modalkey].id,
            qt: modalqt,
            size,
            identifier
        })
    }
    updateCart()
    closeModal()
})

c('.menu-openner').addEventListener('click', ()=>{
    if (cart.length > 0){
        c('aside').style.left = 0
    }
})

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw'
})

function updateCart() {
    c('.menu-openner span').innerHTML = cart.length
    console.log('silas')
    if (cart.length > 0) {
        c('aside').classList.add('show')
        c('.cart').innerHTML = ''

        let subtotal = 0
        let desconto = 0
        let total = 0

        for (let i in cart) {
            let pizzaIten = pizzaJson.find((item) => item.id == cart[i].id)

            subtotal += pizzaIten.price * cart[i].qt
            

            let cartItem = c('.models .cart--item').cloneNode(true)
            let pizzaSizeName

            switch (cart[i].size) {
                case '0':
                    pizzaSizeName = 'P'
                    break

                case '1':
                    pizzaSizeName = 'M'
                    break
                case '2':
                    pizzaSizeName = 'G'
                    break
            }
            let pizzaName = `${pizzaIten.name} (${pizzaSizeName})`


            cartItem.querySelector('img').src = pizzaIten.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++
                updateCart()
                
            })

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--
                } else {
                    cart.splice(i,1)
                }
                updateCart()
            })



            c('.cart').append(cartItem)

        }

        desconto = subtotal * 0.1
        total = subtotal - desconto
        
        c('.subtotal span:last-child').innerHTML = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        c('.total span:last-child').innerHTML = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        c('.desconto span:last-child').innerHTML = desconto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        // carrinho mobile

       

    } else {
        c('aside').classList.remove('show')
        c('aside').style.left = '100vw'
    }
}
