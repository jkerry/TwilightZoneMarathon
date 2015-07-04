var observeOffsetMins = 30;

var nextEpisode = {
            episodeName:"",
            huluLink:"",
            fireTime:new Date(),
            set:false,
            matches:function( otherEpisode ){
                return this.episodeName == otherEpisode.episodeName && this.huluLink == otherEpisode.huluLink;
            }
        };
var currentEpisode = {
            episodeName:"",
            huluLink:"",
            fireTime:new Date(),
            set:false
        };

var getAdjustedLocalTime = function(){
    return new Date();
}

var getNextShowTime = function( time ){
    return new Date( time.getTime() + observeOffsetMins * 60000 );
}

var filterMArathonScheduleByTime = function(marathonSchedule, time){
    return marathonSchedule.filter( function ( el ){
        return el.fireTime <= time && getNextShowTime(el.fireTime) > time;
    });
}

var loadNextEpisode = function( marathonSchedule, timeFunction){
    var time = timeFunction();
    var validEpisodes = filterMArathonScheduleByTime( marathonSchedule, time);
    if(validEpisodes != null && validEpisodes[0] != null ){
        if(nextEpisode != null && nextEpisode.matches(validEpisodes[0])){
            return;
        }
        cloneNextEpisode(validEpisodes[0]);
        _gaq.push(['_trackEvent', 'Episode['+nextEpisode.episodeName+']', 'Loaded']);
    }
    else{
        console.log("No valid episodes found.  There might be a problem");
    }
} 

var cloneNextEpisode = function( newNextEpisode ){
    nextEpisode.episodeName = newNextEpisode.episodeName;
    nextEpisode.huluLink = newNextEpisode.huluLink;
    nextEpisode.fireTime = newNextEpisode.fireTime;
    nextEpisode.clicked = false;
    nextEpisode.set=true;
}

var cloneCurrentEpisode = function( newCurrentEpisode ){
    currentEpisode.episodeName = newCurrentEpisode.episodeName;
    currentEpisode.huluLink = newCurrentEpisode.huluLink;
    currentEpisode.fireTime = newCurrentEpisode.fireTime;
    currentEpisode.set=true;
}

var renderEpisode = function( target ){
    if(target.set){
        var height = "innerHeight" in window 
           ? window.innerHeight
           : document.documentElement.offsetHeight; 
        var iframeHtml = '<iframe width="100%" height="'+height+'px" src="'+target.huluLink+'" frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe>';
        $('#Content').html(iframeHtml);
        cloneCurrentEpisode(target);
        _gaq.push(['_trackEvent', 'Episode['+currentEpisode.episodeName+']', 'Played']);
    }
}

$(document).ready(function(){                
    loadNextEpisode(marathonSchedule, getAdjustedLocalTime);
    $('button#NextEpisode').click(function(elem){ 
        renderEpisode(nextEpisode);
        nextEpisode.clicked = true; 
    });
    rivets.bind($('button#NextEpisode'), {nextEpisode: nextEpisode});
    rivets.bind($('span#CurrentEpisode'), {currentEpisode: currentEpisode});
    setInterval(function () {
        loadNextEpisode(marathonSchedule, getAdjustedLocalTime);
    }, 60000);
});