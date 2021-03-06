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
    feeds : [],
};


//ajax 데이터 통신함수
function getData(url){
    ajax.open('GET',url,false);  // false => 동기로 처리
    ajax.send();

    return JSON.parse(ajax.response); // json으로 받아온것을 객체로 변환;
}

// 피드를 읽었는지 안읽었는지 체크하는 함수
function makeFeeds(feeds){
    for (let i = 0; i < feeds.length; i++) {
        feeds[i].read = false;
    }

    return feeds;
}

// 뉴스피드 목록 구성하하는 함수
function newsFeed(){
    // const newsFeed = getData(NEWS_URL);
    let newsFeed = store.feeds;
    const newsList = [];

    if (newsFeed.length == 0) {
        newsFeed = store.feeds = makeFeeds(getData(NEWS_URL));
    }
    // 마킹해주기
    // m => margin x => 가로값 p=> padding
    let template = `
    <div class="bg-gray-600 min-h-screen">
        <div class="bg-white text-xl">
            <div class="mx-auto px-4">
                <div class="flex justify-between items-center py-6">
                    <div class="flex justify-start">
                        <h1 class="font-extrabold">Hacker News</h1>
                    </div>
                    <div class="items-center justify-end">
                        <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                        Previous
                        </a>
                        <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                        Next
                        </a>
                    </div>
                </div> 
            </div>
        </div>
        <div class="p-4 text-2xl text-gray-700">
            {{__news_feed__}}        
        </div>
    </div>
    `


    for (let i = (store.currentPage - 1) * 10 ; i < store.currentPage * 10; i++) {
        // 안에서 fas fa-user의 부분은 font awesome의 부분이다.
        if (newsFeed[i]) {
            newsList.push(`
                <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
                    <div class="flex">
                        <div class="flex-auto">
                            <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
                        </div>
                        <div class="text-center text-sm">
                            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
                        </div>
                        </div>
                        <div class="flex mt-3">
                        <div class="grid grid-cols-3 text-sm text-gray-500">
                            <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
                            <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
                            <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
                        </div>  
                    </div>
                </div>    
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

    let template = `
        <div class="bg-gray-600 min-h-screen pb-8">
            <div class="bg-white text-xl">
                <div class="mx-auto px-4">
                    <div class="flex justify-between items-center py-6">
                        <div class="flex justify-start">
                            <h1 class="font-extrabold">Hacker News</h1>
                        </div>
                        <div class="items-center justify-end">
                            <a href="#/page/${store.currentPage}" class="text-gray-500">
                                <i class="fa fa-times"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="h-full border rounded-xl bg-white m-6 p-4 ">
                <h2>${newsContent.title}</h2>
                <div class="text-gray-400 h-20">
                    ${newsContent.content}
                </div>

                {{__comments__}}

            </div>
        </div>
    `;

    for (let i = 0; i < store.feeds.length; i++) {
        if(store.feeds[i].id = Number(id)){
            store.feeds[i].read = true;
            break;
        }
    }
    // comment 창 만드는 구조
    function makeComment(comments , called = 0) {
        // 배열구조로 생성
        const commentString = [];

        for (let i = 0; i < comments.length; i++) {
            commentString.push(`
            <div style="padding-left: ${ called * 40}px;" class="mt-4">
                <div class="text-gray-400">
                    <i class="fa fa-sort-up mr-2"></i>
                    <strong>${comments[i].user}</strong> ${comments[i].time_ago}
                </div>
                <p class="text-gray-700">${comments[i].content}</p>
            </div>      
            `)

            if(comments[i].comments.length > 0){
                commentString.push(makeComment(comments[i].comments, called + 1));
            }
        }

        return commentString.join('');

    }

    container.innerHTML = template.replace('{{__comments__}}',makeComment(newsContent.comments));
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


