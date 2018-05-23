$(document).ready(function(){
  $.ajax(gettingPosts); //what is this again? lol. just YOUR posts? 
  $.ajax(gettingAllPosts);
});

var gettingPosts = {
  url: '/search/getAll',
  type: 'get',
  dataType: 'json',
  success: function(postings) {
    for (var i = 0; i < postings.length; i++) {
      $('#foundSearches').append('<li>' + postings[i].titleName + 'by ' + postings[i].author + '(' + postings[i].userId + ')</li>');
    }
  },
  error: function(err) {
    console.log(err);
  }
}

var gettingAllPosts = {
  url: '/search/getActuallyAll',
  type: 'get',
  dataType: 'json',
  success: function(postings) {
    for (var i = 0; i < postings.length; i++) {
      $('#postbox').append('<li>(' + postings[i].time.slice(0, 10) + ') <strong><a href="/search/' + postings[i]._id + '">'  + postings[i].titleName + '</strong></a> by <a href="/search/makemessage">' + postings[i].author + '</a></li>');  // I wanna have the username get put in the recipient field, but it's not super important. 
      console.log(postings[i].author);
    }
  },
  error: function(err) {
    console.log(err);
  }
}


