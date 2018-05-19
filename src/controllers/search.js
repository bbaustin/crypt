var express           = require('express'),
    SearchController  = express.Router(),
    bandcamp          = require('bandcamp-scraper'),
    discogs           = require('disconnect').Client,
    Search            = require(__dirname + '/../models/search'),
    Employee          = require(__dirname + '/../models/employee'),
    Posting           = require(__dirname + '/../models/posting'), 
    Message           = require(__dirname + '/../models/message'),
    Boss              = require(__dirname + '/../models/boss');


// User History Page
// SearchController.route('/userHistory')
//   .get(function(req, res, next) {
//     res.render('userHistory');
//   });


//make post
// SearchController.route('/makePosting') 
//   .get(function(req, res, next) {
//     // res.render('makePosting');
//     // console.log('line 22')
//     Posting.find({userID: req.session.userId}, function(err, postings) {
//       res.json(postings);
//     })
//   });


// Actually All Searches in JSON
  SearchController.route('/getActuallyAll')
  .get(function(req, res, next) {
    Posting.find(function(err, postings) {
      res.json(postings);
    });
  });

// Searches by User Id in JSON
SearchController.route('/getAll')
  .get(function(req, res, next) {
    Posting.find({userId: req.session.userId}, function(err, postings) {
      res.json(postings);
    });
  });

  // Searches by User Id in JSON
SearchController.route('/getMessages')
  .get(function(req, res, next) {
    Message.find({userId: req.session.userId}, function(err, messages) {
      res.json(messages);
    });
  });


// 5-19/20. not exactly working. keep working on messages between users
SearchController.route('/makeMessage')
  .get(function(req, res, next) {
    res.render('makeMessage');
  })
  .post(function(req, res, next) {
    Boss.findById(req.session.userId, function(err, boss) {
      Message.create({
        username: boss.username,
        recipient: req.body.recipient,
        content: req.body.content,
        time: {type: Date, default: Date.now}
      })

      res.render('makePosting', {
        username: boss.username
      })
    })
  });


// Search Page
SearchController.route('/?') 
  .get(function(req, res) {
    console.log(req.session.userId, 'this is the session variable')
    if (req.session.isLoggedIn === null || req.session === null) {
      res.render('home');
    }
    else {
      Boss.findById(req.session.userId, function(err, boss) {
        res.render('search', {
          username: boss.username
        });
      });
    }
  })
  //make post
  .post(function(req, res, next) {
    Posting.create({
      userId: req.session.userId,
      titleName: req.body.titleName,
      postContent: req.body.postContent,
      author: req.session.username
    },
    function(err, posting, boss) {
      if (err) {
        console.log(err);
        res.render('search');
      }
      else {
        Boss.findById(req.session.userId, function(err, boss) {
          Posting.find(function(err, posting) {
            if (posting.userId === req.session.userId) {
              console.log('does thsi ever get hit?')
              res.render({titleName: posting.titleName})
            }       
            res.render('makePosting', {
              username: boss.username,
              titleName: posting.titleName,
              author: posting.author
            })
          });
        });
      }
    });
  });



  //   var foundCounter = 0; 
  //   Search.create({
  //     query: req.body.query,
  //     userId: req.session.userId,
  //     found: false
  //   });
  // });

  











///////////  DISCOGS  ////////////
//     var db = new discogs({
//       consumerKey: 'ASYxbejFTvCfHSryhgKr', 
//       consumerSecret: 'NPbNIIhHUrdGYgQMPWIfEyFCIGkwvNeY'}).database();
//       // consumerKey: process.env.PUBLIC_KEY, 
//       // consumerSecret: process.env.SECRET_KEY}).database();
//     db.search([req.body.query], ['artist'], function(err, data) {
//       //console.log(data);
//       if (err) {
//         console.log('your discogs thing has error ' + err);
//       }
//       else if (data.pagination.items===0) { 
//         console.log(req.body.query + " is not found on discogs");
//       }
//       else {
//         for (var i = 0; i < data.results.length; i++) {
//           if (data.results[i].type === 'artist' && data.results[i].title.toLowerCase() === req.body.query.toLowerCase()) {
//             console.log('line before foundCounter plus two');
//             foundCounter+=2;
//             console.log(foundCounter);
//             console.log('It looks like ' + req.body.query + ' has something on Discogs');
//             Search.find({query: req.body.query}, function (err, toUpdate) {
//               for (var j = 0; j < toUpdate.length; j++) {
//               toUpdate[j].update({found:true}, function (err, raw) {
//                 if (err) console.log("err " + err);
//                 console.log(raw);
//               });
//               }
//             });
//             i = data.results.length;
//           }
//           else {
//             console.log('I dont think ' + req.body.query + ' is an existing band name');
//           }
//         }
//       }
//     });
// ///////////  BANDCAMP SCRAPER  ////////////
//     bandcamp.search({
//       query: req.body.query,
//       page: 1
//       }, function(error, results) {
//         if (error) {
//           console.log(error);
//           res.send('there was an error with POST /search');
//         } 
//     /////////  TYPE: ALBUM  /////////    
//         else if (results[0].type === 'album') {
//           console.log('BAND CAMP ALBUM SEARCH');
//           if (req.body.query.toLowerCase() === results[0].artist.toLowerCase()) {
//             foundCounter++;
//             Search.find({query: req.body.query}, function (err, toUpdate) {
//               for (var i = 0; i < toUpdate.length; i++) {
//                 toUpdate[i].update({found:true}, function (err, raw) {
//                 if (err) console.log(err);
//                   console.log(raw);
//                 });
//               }
//             });
//           }
//         }
//     /////////  TYPE: ARTIST  /////////    
//         else if (results[0].type === 'artist') {
//           console.log('BAND CAMP ARTIST SEARCH');          
//           if (req.body.query.toLowerCase() === results[0].name.toLowerCase()) {
//             foundCounter++;
//             Search.find({query: req.body.query}, function (err, toUpdate) {
//               for (var i = 0; i < toUpdate.length; i++) {
//                 toUpdate[i].update({found:true}, function (err, raw) {
//                   if (err) console.log(err);
//                   console.log(raw);
//                 });
//               }
//             });
//           };
//         };
//     console.log(foundCounter + " line 122");
//     if (foundCounter === 0) {
//       res.render('searchResult', {
//         query: req.body.query,
//         link: '/search',
//         image: '',
//         comment: '.<br/> It looks like that band name is still available.'
//       });
//     }
//     // If only found on Discogs
//     else if (foundCounter%2 === 0) {
//       res.render('searchResult', {
//         query: req.body.query,
//         link: '/search', // Change this to a discogs link :D 
//         image: '',
//         comment: '.<br/> Sorry, but it looks like that band name has been taken already. Try again!'
//       });
//     }
//     // Found on Bandcamp, and potentially Discogs
//     else if (foundCounter%2 === 1) {
//       res.render('searchResult', {
//         query: req.body.query,
//         link: results[0].link, 
//         image: '<img src=' + results[0].image + '/>',
//         comment: '.<br/> Sorry, but it looks like that band name has been taken already. Try again!' 
//       });
//     } 
//   });
// });


module.exports = SearchController;
