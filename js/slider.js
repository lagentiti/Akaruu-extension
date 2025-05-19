// const btnTwitch = document.getElementById('btnTwitch')
// const btnYoutube = document.getElementById('btnYoutube')

// const sliderCases = document.querySelectorAll('.slider-case')
// const sliderTwitch = document.getElementById('sliderTwitch')
// const sliderYoutube = document.getElementById('sliderYoutube')

// let translationComplete = true

// for (let i = 0; i < sliderCases.length; i++) {
//   sliderCases[i].addEventListener('transitionend', function () {
//     if (sliderCases[i].style.left === '-410px') {
//       sliderCases[i].style.display = 'none'
//       sliderCases[i].style.left = '410px'
//       setTimeout(function () {
//         if (sliderCases[i].style.left === '410px') {
//           sliderCases[i].style.display = 'block'
//           translationComplete = true
//         }
//       }, 50)
//     }
//   }, true)
// }

// btnTwitch.addEventListener('click', function () {
//   if (translationComplete === true && !sliderTwitch.classList.contains('active')) {
//     translationComplete = false
//     btnTwitch.classList.add('active')
//     btnYoutube.classList.remove('active')
//     next(sliderTwitch)
//   }
// })

// btnYoutube.addEventListener('click', function () {
//   if (translationComplete === true && !sliderYoutube.classList.contains('active')) {
//     translationComplete = false
//     btnYoutube.classList.add('active')
//     btnTwitch.classList.remove('active')
//     next(sliderYoutube)
//   }
// })

// function next(id) {
//   for (let i = 0; i < sliderCases.length; i++) {
//     if (sliderCases[i].classList.contains('active')) {
//       sliderCases[i].style.left = '-410px'
//       sliderCases[i].classList.remove('active')
//     }
//   }

//   id.style.left = '0px'
//   id.classList.add('active')
// }