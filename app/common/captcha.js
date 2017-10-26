/**
 * 生成图片验证码
 * @param options
 *          {
 *              width:
 *              height:
 *              text:
 *              background: [red, green, blue, alpha]
 *              color: [red, green, blue, alpha]
 *          }
 * @return Base64
 */
exports.generateBase64 = generateBase64 = function(options) {
    var height = options.height || 20, text = '' + options.text, width = options.width || height * text.length;
    var p = new require('captchapng')(width, height, text); // width,height,numeric captcha
    p.color.apply(p, options.background || [0, 0, 0, 0]);  // First color: background (red, green, blue, alpha)
    p.color.apply(p, options.color || [80, 80, 80, 255]); // Second color: paint (red, green, blue, alpha)

    return p.getBase64();
};

/**
 * 生成图片验证码
 * @param options
 *          {
 *              width:
 *              height:
 *              text:
 *              background: [red, green, blue, alpha]
 *              color: [red, green, blue, alpha]
 *          }
 * @return ImageBuffer
 */
exports.generate = function(options) {
    return new Buffer(generateBase64(options), 'base64');
};