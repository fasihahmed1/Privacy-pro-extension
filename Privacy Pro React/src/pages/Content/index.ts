
console.log('Content Working');
//@ts-ignore
import {contentPopup} from './index.js'

contentPopup();
chrome.runtime.onMessage.addListener((request: { action: string; link?: string }) => {
    if (request.action === 'clickVideo' && request.link) {
        console.log('Message received with link:', request.link);
        videoClicked(request.link);
    } else {
        console.log('Oops!');
    }
});

async function videoClicked(link: string): Promise<void> {

}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


