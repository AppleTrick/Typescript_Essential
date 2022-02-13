const container = document.getElementById('root');

const ajax = new XMLHttpRequest();

const content = document.createElement('div');

// url 페이징에서 바뀔 가능성이 있음 => 바뀔 가능성이 있으면 
// 뉴스들에 대한 정보 가지고 오는 url
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'

// content 정보 가지고 오는 url
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

function getData(url){
    ajax.open('GET',url,false);  // false => 동기로 처리
    ajax.send();

    return JSON.parse(ajax.response); // json으로 받아온것을 객체로 변환;
}

const newsFeed = getData(NEWS_URL);

const ul = document.createElement('ul');


// 주소가 변경될때 작동하는 이벤트
window.addEventListener('hashchange',function(){
    
    // 주소에 관련된 내용 가지고 오는법
    const id = location.hash.substring(1); // id 값을 가지고 옴
    const newsContent = getData(CONTENT_URL.replace('@id',id))
    const title = document.createElement('h1');

    title.innerHTML = newsContent.title;
    content.appendChild(title)
});

for (let i = 0; i < 10; i++) {
    const div = document.createElement('div');

    div.innerHTML =  `
    <li>
        <a href = "#${newsFeed[i].id}"> 
            ${newsFeed[i].title} (${newsFeed[i].comments_count}) 
        </a>
    </li>
    `;
   
    // ul.appendChild(div.children[0]);
    ul.appendChild(div.firstElementChild);
}

container.appendChild(content);
container.appendChild(ul);
