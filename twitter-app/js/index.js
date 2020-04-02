// if you want to active the next page function jsut comment in the code 

const URL = "http://localhost:3000/tweets";
let nextPageUrl = null

window.onload = function(){
	document.getElementById("search-tweet").addEventListener("click", getTwitterData);
	document.getElementById("change-display-page-white").addEventListener("click", changeDisplayWhite);
    document.getElementById("change-display-page-dark").addEventListener("click", changeDisplayDark);
}

const changeDisplayDark = () => {
    document.getElementById('container-home').style.backgroundColor = "#0F0F11";
    document.getElementById('container-home').style.color = "rgba(255, 255, 255, 0.74)";
    document.getElementById('user-search-input').style.backgroundColor = "#0F0F11";
    document.getElementById('search-tweet').style.backgroundColor = "#0F0F11";
    document.getElementById('search-tweet').style.color = "white";
    document.getElementById('logo').style.color = "white";
}


const changeDisplayWhite = () => {
    document.getElementById('container-home').style.backgroundColor = "white";
    document.getElementById('container-home').style.color = "black";
    document.getElementById('user-search-input').style.backgroundColor = "white";
    document.getElementById('user-search-input').style.color = "rebeccapurple";
    document.getElementById('search-tweet').style.backgroundColor = "white";
    document.getElementById('search-tweet').style.color = "rebeccapurple";
    document.getElementById('logo').style.color = "rebeccapurple";
}


// this is how add an addEventListener for enter key
const onEnter = (e) => {
    if(e.key == "Enter") {
        getTwitterData();
    }
}

// const onNextPage = () => {
//     if(nextPageUrl){
//         getTwitterData()
//     }
// }

const getTwitterData = () => {
    const query = document.getElementById("user-search-input").value;
    // we use encodeURIComponent in case the user add any sign to search ($%#%^!@)
    // so without encodeURIComponent our link would break
    if(!query) return;
    const encodedQuery = encodeURIComponent(query);
    const params = `q=${encodedQuery}&count=10`;
    let fullUrl = `${URL}?${params}`;
    // if(nextPageUrl){
    //     fullUrl = nextPageUrl
    // }
    fetch(fullUrl, {
        method: 'GET'
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        buildTweets(data.statuses);
        // saveNextPage(data.search_metadata);
        // nextPageButtonVisibility(data.search_metadata)
    });
}

// const saveNextPage = (metadata) => {
//     if(metadata.next_results){
//         nextPageUrl = `${URL}${metadata.next_results}`
//     } else {
//         nextPageUrl = null
//     }
// }

// const nextPageButtonVisibility = (metadata) => {
//     if (metadata.next_results){
//         document.getElementById('next-page').style.visibility = 'visible'
//     } else {
//         document.getElementById('next-page').style.visibility = 'hidden'
//     }
// }

const buildTweets = (tweets, nextPage) => {
    let twitterContent = "";
    // var x = Object.keys(tweets).length;
    if (Object.keys(tweets).length === 0){
    let twitterEmpty = ''
    	twitterEmpty += `
		 <div class="tweets-welcome-message">
            <h5>Welcome to Twitter!</h5>
            <p>Use the search above to see what's happening around the world.</p>
        </div> 
    	`
    	document.querySelector('.tweets-list').innerHTML = twitterEmpty;
    } else {
    tweets.map((tweet)=>{
    	const createdDate = moment(tweet.created_at).fromNow();
        const createdDateProfile = moment(tweet.user.created_at).fromNow();
        twitterContent += `
            <div class="tweet-container">
                <div class="tweet-user-info">
                    <div class="tweet-user-profile">
                        <a href="#"><img class="tweet-user-profile-image" src="${tweet.user.profile_image_url_https}" data-toggle="modal" data-target="#exampleModalCenter"></a>

                        <!-- Modal -->
                        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                          <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLongTitle" style="border-block-end-style:;color: black;">${tweet.user.name}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div class="modal-body">
                                <img class="tweet-user-profile-modal-image" src="${tweet.user.profile_image_url_https}" style="
                                    width: 200px;
                                    height: 160px;
                                    position: relative;
                                    left: 25%;
                                ">
                                <p style='color: black'>friends: <span>${tweet.user.friends_count}</p></span>
                                <p style='color: black'>member since: <span>${createdDateProfile}</p></span>
                                <p style='color: black'>Followers: <span>${tweet.user.followers_count}</p></span>
                              </div>
                              <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div class="tweet-user-name-container">
                        <div class="tweet-user-fullname">${tweet.user.name}</div>
                        <div class="tweet-user-username">@${tweet.user.screen_name}</div>
                    </div>
                </div>
        `

        // that's how we check if the tweet include any element of media
        if(tweet.extended_entities 
            && tweet.extended_entities.media
            && tweet.extended_entities.media.length > 0){
            twitterContent += buildImages(tweet.extended_entities.media);
            twitterContent += buildVideo(tweet.extended_entities.media);
        }
        twitterContent += `
                <div class="tweet-text-container">
                    <span class="tweet-text">
                    ${tweet.full_text}
                    </span>
                </div>
                <div class="tweet-date-container">
                	${createdDate}
                </div>
            </div>
        `
    	
    })
    // if (nextPageUrl){
    //         document.querySelector('.tweets-list').insertAdjacentHTML('beforeend', twitterContent);
    // } else {
            document.querySelector('.tweets-list').innerHTML = twitterContent;
        // }
    }

}

const buildImages = (mediaList) => {
    let imagesContent = `<div class="tweet-images-container">`;
    let imagesExist = false;
    mediaList.map((media)=>{
// we check here for the element type if it photo 
// imagesExist would be true
        if(media.type == "photo"){
            imagesExist = true;
            imagesContent += `
                <div class="tweet-image" style="background-image: url(${media.media_url_https})"></div>
            `
        }
    })
    imagesContent += `</div>`;
    return (imagesExist ? imagesContent : '');
}

const buildVideo = (mediaList) => {
    let videoContent = `<div class="tweet-video-container">`;
    let videoExist = false;
    mediaList.map((media)=>{
        if(media.type == "video"){
            videoExist = true;
            const videoVariant = media.video_info.variants.find((variant) => variant.content_type == 'video/mp4')
            videoContent += `
                <video controls>
                    <source src=${videoVariant.url} type="video/mp4">
                </video>
            `
        } else if (media.type == "animated_gif"){
            videoExist = true;
            const videoVariant = media.video_info.variants.find((variant) => variant.content_type == 'video/mp4')
            videoContent += `
                <video loop autoplay>
                    <source src=${videoVariant.url} type="video/mp4">
                </video>
            `

        }
    })
    videoContent += `</div>`;
    return (videoExist ? videoContent: '');
}


// 1 - get all the element with li 
// 2 - get thier value 
// 3 - access this value to search
// 4 - call getTwitterData

const selectTrend = (e) => {
	const trendText = e.innerHTML
	document.getElementById("user-search-input").value = trendText
	getTwitterData()
}