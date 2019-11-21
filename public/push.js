var webPush = require('web-push');

const vapidKeys = {
  "publicKey": "BE6U063OmMDV3FWXd8gPvjdA66LKKe-Z5uLFJgMUH-MF_AIk3DmWoWpiDnpOlTYZWserxiRS9LMPd-twhiikQZU",
  "privateKey": "Wl-tRVLoc4DW95648Zd07X70csreU1c4AVr-PXErdGQ"
};

webPush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

var pushSubscription = {
  "endpoint": "https://fcm.googleapis.com/fcm/send/c0AFDoP4G9s:APA91bGNxVB32d5rNWYuGTTQfxa7BrwQoKsWakaYPKl0hdpttUCD_FwpwoHhnk8ikJJthBScwEI-ImuGa16UEv-9xftK1EP3ql6xzByRmZmWKeUW08tYFyNI0z33cWJ4FtEWeQHnRU59",
  "keys": {
    "p256dh": "BDoaYAbMi5kz3yoA1oq4sgfIUejhO0vDA6Ir8haOVHIgVCit2N2vd3JXKsCjykLTfoBq+7i8OWy6HrnjD308tlQ=",
    "auth": "4KQy3hx0ne7Ww/+MLeZdTg=="
  }
};

var payload = "Jangan lupa untuk melihat tim kesayangan anda di liga Inggris";

var options = {
  gcmAPIKey: '70926520043',
  TTL: 60
};

webPush.sendNotification(
  pushSubscription,
  payload,
  options
);
