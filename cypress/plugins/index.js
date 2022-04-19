// <reference types="cypress" />
//This code was created using the following discord bot guide https://birdie0.github.io/discord-webhooks-guide/discord_webhook.html
const Discord = require("discord.js"); // discord.js library

module.exports = (on, config) => {
  on("after:run", async (results) => {
    const webhook = new Discord.WebhookClient(
      { url: discordUrl } /*"add here the url of your discord webhook"*/,
      { restRequestTimeout: 120000, waitGuildTimeout: 120000 }
    );

    const percentFailed =
      //simple calculation of percent of failed tests based on total tests
      ((results.totalFailed / results.totalTests) * 100).toFixed(2);

    const percentPassed =
      //% of passed tests based on total tests, decides the color of the message
      ((results.totalPassed / results.totalTests) * 100).toFixed(2);

    let browserIcon; // This is based on the browser that your tests are ran, it will switch the emoticons based on results
    switch (
      results.browserName // The codes of these emotes might not work in your server, download the browser PNGs and upload them to your server
    ) {
      case "chrome":
        browserIcon = "<:chrome:964842543940522004>"; //to get this code of your uploaded emotes type \:chrome: in your discord server chat
      case "firefox":
        browserIcon = "<:firefox:965527821214707752>";
      case "safari":
        browserIcon = "<:Safari:965531150640611358>";
    }

    webhook
      .send({
        //Next lines of code contain the payload that discord receives through the webhook
        username: "Bot name",
        avatar_url:
          "icon url" /*"add here the avatar of your bot, or completely delete it if you have it in your discord webhook"*/,
        embeds: [
          {
            author: {
              name: `Cypress v${results.cypressVersion}`,
              /*I've added cypress icon here from random google search image to make it more aesthetic */
              icon_url:
                "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/q1cwqhahz7jbtfzalznd",
            },
            title:
              ":bookmark_tabs:   Automation Run Summary \n ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯",
            timestamp: `${results.endedTestsAt}`, // This will add timestamp of exact date execution in your message
            color: Number(percentPassed) < 95 ? 15828224 : 9297690, // Orange color of the message if more than 5% of tests have failed
            fields: [
              {
                name: ":white_check_mark:  Passed",
                value: `**[ ${results.totalPassed} ]**`,
                inline: true,
              },
              {
                name: ":red_circle:  Failed",
                value: `**[ ${results.totalFailed} ]**`,
                inline: true,
              },
              {
                name: ":warning:  Pending",
                value: `**[ ${results.totalPending} ]**`,
                inline: true,
              },
              {
                name: ":notepad_spiral:  Total tests",
                value: `**[ ${results.totalTests} ]** *( ${percentFailed}% failed )*`,
                inline: true,
              },
              {
                name: ":play_pause:  Skipped",
                value: `**[ ${results.totalSkipped} ]**`,
                inline: true,
              },
              {
                name: "Browser",
                value: `${browserIcon} v${results.browserVersion}`,
              },
              {
                name: ":clipboard:  Report archive:",
                value: `[Download](http:// <your CI Pipeline url>)`, // You can add the link to the artefacts of your pipeline run here (screenshots, videos etc)
              }, //I'm using gitlab as version control so the artefact download link is called using the 'process.env.CI_JOB_ID' variable from the execution run
            ],
            footer: {
              text: "Completed on",
            },
          },
        ],
      })
      .then((response) => console.error("response =", response))
      .catch((error) => console.error("error send file =", error));
  });
};
