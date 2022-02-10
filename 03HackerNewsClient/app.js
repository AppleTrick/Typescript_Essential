const ajax = new XMLHttpRequest();

// url 페이징에서 바뀔 가능성이 있음 => 바뀔 가능성이 있으면 
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'

ajax.open('GET',NEWS_URL,false);  // false => 동기로 처리
ajax.send();

const newsFeed = JSON.parse(ajax.response); // json으로 받아온것을 객체로 변환;

const ul = document.createElement('ul');

for (let i = 0; i < 10; i++) {
    const li = document.createElement('li');
    const a = document.createElement('a');

    a.href = '#';
    a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count})`;

    ul.appendChild(li);
    li.appendChild(a);
}

document.getElementById('root').appendChild(ul);
