export function loadHeader() {
    let main = document.getElementById('container')
    let header = document.createElement('h1')
    header.textContent = `Chris' Todo`
    main.appendChild(header)
}