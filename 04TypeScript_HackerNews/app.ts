interface Store {
    currentPage : number;
    feeds : NewsFeed[];
}

interface News {
    readonly id : number;
    readonly time_ago : string;
    readonly user : string;
    readonly title : string;
    readonly url : string;
    readonly content : string;
}

interface NewsFeed extends News {
    readonly comments_count : number;
    readonly points : number;
    read ?: boolean;
}

interface NewsDetail extends News {
    readonly comments : NewsComment[];
}

interface NewsComment extends News {
    readonly comments : NewsComment[];
    readonly level : number;
}

// root
const container : HTMLElement | null = document.getElementById('root');
// ajax 통신 사용
const ajax : XMLHttpRequest = new XMLHttpRequest();
// 뉴스들에 대한 정보 가지고 오는 url
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
// content 정보 가지고 오는 url
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
// 공유되는 자원
const store : Store = {
    currentPage : 1,
    feeds : [],
};

class Api{
    url : string;
    ajax : XMLHttpRequest;

    // 최초 생성될 때 처리를 하는 곳
    constructor(url : string){
        this.url = url;
        this.ajax = new XMLHttpRequest();
    }

    protected getRequest<AjaxResponse>() : AjaxResponse {
        this.ajax.open('GET',this.url,false);
        this.ajax.send();

        return JSON.parse(this.ajax.response);
    }

}

class NewsFeedApi extends Api {
    getData() : NewsFeed[] {
        return this.getRequest<NewsFeed[]>();
    }
}

class NewsDetailApi extends Api {
    getData() : NewsDetail {
        return this.getRequest<NewsDetail>();
    }
}

// 피드를 읽었는지 안읽었는지 체크하는 함수
function makeFeeds(feeds : NewsFeed[]) : NewsFeed[]{
    for (let i = 0; i < feeds.length; i++) {
        feeds[i].read = false;
    }

    return feeds;
}

function updateView(html : string) : void{
    if(container != null){
        container.innerHTML = html;
    }else{
        console.log("컨테이너의 최상위 root가 없어서 진행하지 못합니다.");
        
    }
}

// 뉴스피드 목록 구성하하는 함수
function newsFeed() : void {
    const api = new NewsFeedApi(NEWS_URL);

    let newsFeed : NewsFeed[] = store.feeds;
    const newsList = [];

    if (newsFeed.length == 0) {
        newsFeed = store.feeds = makeFeeds(api.getData());
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
    template = template.replace("{{__preview_page__}}", String(store.currentPage > 1 ? store.currentPage - 1 : 1));
    template = template.replace("{{__next_page__}}", String(newsFeed[store.currentPage * 10] ? store.currentPage + 1 : store.currentPage));

    updateView(template);
    
}

function newsDetail() : void {
    

    // 주소에 관련된 내용 가지고 오는법
    const id = location.hash.substring(7); // id 값을 가지고 옴
    const api = new NewsDetailApi(CONTENT_URL.replace('@id', id));
    const newsContent = api.getData();

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
        if(store.feeds[i].id == Number(id)){
            store.feeds[i].read = true;
            break;
        }
    }
    

    updateView(template.replace('{{__comments__}}',makeComment(newsContent.comments)));
 
}
// comment 창 만드는 구조
function makeComment(comments : NewsComment[]) : string{
    // 배열구조로 생성
    const commentString = [];

    for (let i = 0; i < comments.length; i++) {
        const comment : NewsComment = comments[i]
        commentString.push(`
        <div style="padding-left: ${ comment.level * 40}px;" class="mt-4">
            <div class="text-gray-400">
                <i class="fa fa-sort-up mr-2"></i>
                <strong>${comment.user}</strong> ${comment.time_ago}
            </div>
            <p class="text-gray-700">${comment.content}</p>
        </div>      
        `)

        if(comment.comments.length > 0){
            commentString.push(makeComment(comment.comments));
        }
    }

    return commentString.join('');
}

function router() : void{
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


