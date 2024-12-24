var pageLoadTime = new Date();
function clientNeedsReload () {
    fetch('./ServerAdminService.clientNeedsReload', {
            method: 'post',
            // body: JSON.stringify({}),
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
            }).catch(er => {
                console.warn("No response from clientNeedsReload");
                    document.querySelector("#serverIsDown").style.display = "inline";
                    setTimeout(clientNeedsReload, 2000);
                    return;
            })
            .then(httpResponse => httpResponse.json())
            .then(response => {
                if (response.error) {
                    if (response.forceReload) {
                        location.reload();
                    }
                    document.querySelector("#serverIsDown").style.display = "inline";
                    setTimeout(clientNeedsReload, 2000);
                    return;
                } else {
                    document.querySelector("#serverIsDown").style.display = "none";
                }
                if (response.needsReload != null && new Date(response.needsReload) > pageLoadTime) {
                    // clearInterval(clientNeedsReloadInterval);
                    document.querySelector("#clientNeedsReloadButton").style.display = "inline";
                }
                
                setTimeout(clientNeedsReload, 5000);
                
            });
    }
    setTimeout(clientNeedsReload, 5000);