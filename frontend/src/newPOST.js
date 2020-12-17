export function createNewPost(api, token, text, src) {
    api.post('post', {
        body: JSON.stringify({
            "description_text": text,
            "src": src,
        }),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        }
    }).then(
        res => {
            if (res) {
                // console.log(res["post_id"]);
                alert('Post success!');
                return res["post_id"];
            }
        }
    ).catch(err => console.warn(`API_ERROR: ${err.message}`));
}