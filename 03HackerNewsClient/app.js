// root
const container = document.getElementById('root');
// ajax 통신 사용
const ajax = new XMLHttpRequest();
// 뉴스들에 대한 정보 가지고 오는 url
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
// content 정보 가지고 오는 url
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
// 공유되는 자원
const store = {
    currentPage : 1,
};


//ajax 데이터 통신함수
function getData(url){
    ajax.open('GET',url,false);  // false => 동기로 처리
    ajax.send();

    return JSON.parse(ajax.response); // json으로 받아온것을 객체로 변환;
}

// 뉴스피드 목록 구성하하는 함수
function newsFeed(){
    const newsFeed = getData(NEWS_URL);
    const newsList = [];

    // 마킹해주기
    // m => margin x => 가로값 p=> padding
    let template = `
        <div class="container mx-auto p-4">
            <h1>Hacker News</h1>
            <ul>
                {{__news_feed__}}
            </ul>
            <div>
                <a href="#/page/{{__preview_page__}}">이전으로</a> 
                <a href="#/page/{{__next_page__}}">다음으로</a> 
            </div>
        </div>
    `


    for (let i = (store.currentPage - 1) * 10 ; i < store.currentPage * 10; i++) {
        if (newsFeed[i]) {
            newsList.push(`
                <li>
                    <a href = "#/show/${newsFeed[i].id}"> 
                        ${newsFeed[i].title} (${newsFeed[i].comments_count}) 
                    </a>
                </li>
            `);
        }else{
           break;
        }
    }

    // 템플릿으로 교체
    template = template.replace("{{__news_feed__}}", newsList.join(''));
    template = template.replace("{{__preview_page__}}", store.currentPage > 1 ? store.currentPage - 1 : 1);
    template = template.replace("{{__next_page__}}", newsFeed[store.currentPage * 10] ? store.currentPage + 1 : store.currentPage);

    container.innerHTML = template
}

function newsDetail(){

    // 주소에 관련된 내용 가지고 오는법
    const id = location.hash.substring(7); // id 값을 가지고 옴
    const newsContent = getData(CONTENT_URL.replace('@id',id))

    container.innerHTML = `
        <h1>${newsContent.title}</h1>
        <div>
            <a href="#/page/${store.currentPage}">목록으로</a>
        </div>
    `;
}

function router(){
    // 화면전환 => 해쉬에 따른 화면전환이 이뤄져야된다.
    const routePath = location.hash;

    if(routePath == ''){
        // location.hash 에 # 만 들어갔을 경우 빈 문자열을 반환 한다.
        newsFeed();
    }else if(routePath.indexOf('#/page/') >= 0 ){
        store.currentPage = Number(routePath.substring(7));
        newsFeed();
    }else{
        newsDetail();
    }
}

// 주소가 변경될때 작동하는 이벤트
window.addEventListener('hashchange', router);

router();


