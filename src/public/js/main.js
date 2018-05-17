$(document).ready(function(){
  $.ajax(ajax);
  $.ajax(ajax2);
});

var ajax = {
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

var ajax2 = {
  url: '/search/getActuallyAll',
  type: 'get',
  dataType: 'json',
  success: function(postings) {
    for (var i = 0; i < postings.length; i++) {
      $('#postbox').append('<li> (' + postings[i].time.slice(0, 10) + ") <strong>" + postings[i].titleName + '</strong> by ' + postings[i].author + '</li>');
      console.log(postings[i].author);
    }
  },
  error: function(err) {
    console.log(err);
  }
}


