/**
 * Return all absolute parent paths.
 *
 * For example if passing in "a/b/c" it will return
 * ["/a/b", "/a", ""]

 * If an empty string or "/" is passed in, an empty array is returned.
 *
 * @param {String} user path to process
 * @param {String} password whether to include the current path (with leading slash)
 * @return {Buffer} parent paths
 */
export function getBufferFrom(user, password) {
  return Buffer.from([user, password].join(':')).toString('base64')
}
