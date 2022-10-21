/* eslint-disable */
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
  NotFoundException
} from '@zxing/library'
const PDFJS = require('pdfjs-dist/legacy/build/pdf')
const { createCanvas } = require('canvas')
PDFJS.GlobalWorkerOptions.workerSrc = '//cdn.jsdelivr.net/npm/pdfjs-dist@2.8.335/legacy/build/pdf.worker.js'
export default class BarcodeJS {

  env = process.env.NODE_ENV !== 'production' ? 'DEV' : 'PROD'

  readers = {
    aztec: "AZTEC",
    codabar: "CODABAR",
    code_39: "CODE_39",
    code_93: "CODE_93",
    code_128: "CODE_128",
    data_matrix: "DATA_MATRIX",
    ean_8: "EAN_8",
    ean_13: "EAN_13",
    itf: "ITF",
    maxicode: "MAXICODE",
    pdf_417: "PDF_417",
    qr_code: "QR_CODE",
    rss_14: "RSS_14",
    rss_expanded: "RSS_EXPANDED",
    upc_a: "UPC_A",
    upc_e: "UPC_E",
    upc_ean_extension: "UPC_EAN_EXTENSION",
  }

  constructor() {
    this.hints = new Map()
    this.formats = [BarcodeFormat.PDF_417],
    this.hints.set(DecodeHintType.POSSIBLE_FORMATS, this.formats)
    this.codeReader = new BrowserMultiFormatReader(this.hints)
  }

  init(config = {}) {
    this.config = this.extend({}, {
      scale: {
        once: false,
        value: 5,
        start: 3,
        step: 0.5,
        stop: 6,
      },
      resultOpts: {
        singleCodeInPage: true,
        multiCodesInPage: false,
        maxCodesInPage: 1,
      },
      patches: ['x-small', 'small', 'medium', 'large', 'x-large'],
      improve: true,
      noisify: true,
      zxing: {
        readers: ['pdf_417']
      },
      quagga: {
        inputStream: {},
        locator: {
          halfSample: false,
        },
        decoder: {
          readers: ['pdf_417'],
          multiple: true,
        },
        locate: true,
      },
    })
    this.config = this.merge(this.config, config)
    this.arrangeConfigs(this.config)
    return this.config
  }

  extend(settings, options) {
    for (let key in options)
      if (options.hasOwnProperty(key))
        settings[key] = options[key]
    return settings
  }

  merge(obj1, obj2) {
    for (let p in obj2) {
      try {
        if (obj2[p].constructor === Object) {
          obj1[p] = this.merge(obj1[p], obj2[p])
        } else {
          obj1[p] = obj2[p]
        }
      } catch (e) {
        obj1[p] = obj2[p]
      }
    }
    return obj1
  }

  arrangeConfigs(settings) {

    if (!settings.resultOpts.multiCodesInPage || settings.resultOpts.singleCodeInPage) {
      settings.resultOpts.maxCodesInPage = 1
      settings.quagga.decoder.multiple = false
    } else {
      settings.quagga.decoder.multiple = true;
    }

    if (settings.scale.once) {
      let val = parseFloat(settings.scale.value.toFixed(2))
      settings.scale.start = val
      settings.scale.stop = val
      settings.scale.step = 1.0
      settings.scale.ordered = [val]
    } else {
      settings.scale.ordered = []
      let i = settings.scale.start
      for (i = settings.scale.start; i <= settings.scale.stop; i += settings.scale.step) {
        i = parseFloat(i.toFixed(2))
        settings.scale.ordered.push(i)
      }
    }
  }

  getCanvas(viewport) {
    const canvas = createCanvas()
    canvas.width = viewport.width
    canvas.height = viewport.height
    return canvas
  }

  getPageAsImg(canvas, scaled, noisify) {

    const result = {}

    const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height)

    if (scaled === 1) {
      const imgToBePrinted = createCanvas();
      imgToBePrinted.width = canvas.width;
      imgToBePrinted.height = canvas.height;
      imgToBePrinted.getContext('2d').putImageData(imageData, 0, 0);
      result.printImg = imgToBePrinted;
    }

    const imgToProcess = createCanvas()
    imgToProcess.width = canvas.width
    imgToProcess.height = canvas.height
    const context2 = imgToProcess.getContext('2d')
    context2.putImageData(imageData, 0, 0)

    if (noisify) {
      for (let y = 0; y < canvas.height; y += 60) { // Todo 60 worked good, but should be related to img size
        let uint = context2.getImageData(0, y, canvas.width, 1)
        let pix = uint.data
        let draw = true
        for (let i = 0, n = pix.length; i < n; i += 4) {
          if (pix[i] !== 255) {
            draw = false
            break
          }
        }

        if (draw) {
          context2.beginPath();
          context2.moveTo(0, y)
          context2.lineTo(canvas.width, y)
          context2.lineWidth = 2
          context2.strokeStyle = 'red'
          context2.stroke()
        }
      }
    }

    result.processImg = imgToProcess
    return result
  }

  getConfigs(pageAsImg, patchSize, settings) {

    if (this.env === 'DEV') {
      console.log('Configs for patch : ' + patchSize)
      console.log(settings)
    }

    settings.inputStream.size = pageAsImg.width
    settings.locator.patchSize = patchSize
    settings.src = pageAsImg.toDataURL('image/jpeg')
    if (typeof window === 'undefined') { // in nodejs
      settings.debug = false
      settings.numOfWorkers = 0
    }
    return settings
  }

  getDocumentUrl(params) {
    if (typeof window === 'undefined') {
      return params.input
    } else if (typeof params.input === 'object' && params.input !== null && params.input.files !== undefined) {
      return URL.createObjectURL(params.input.files[0])
    } else {
      return params.input
    }
  }

  setResult(result, document_barcode, currentPage, patch, scaled, settings) {

    if (settings.resultOpts.singleCodeInPage) { // when single result  quagga returns obj only

      if (result && result.codeResult) {
        if (this.env === 'DEV') {
          console.log("PAGE_" + currentPage + " has results when scaled " + scaled + " times with " + patch + " patch.");
        }

        this.addResult(result.codeResult, document_barcode, currentPage, patch, scaled)
      } else {
        if (this.env === 'DEV') {
          console.log("PAGE_" + currentPage + " when scaled " + scaled + " times with " + patch + " patch has no results.");
        }
      }
    } else {
      let hasResult = false
      if (result) {
        for (let i = 0; i < result.length; i++) {
          if (result[i].codeResult) {
            if (this.env === 'DEV' && !hasResult) {
              hasResult = true
              console.log('PAGE_' + currentPage + ' when scaled ' + scaled + '  times with ' + patch + ' patch has no results.')
            }

            let codeResult = result[i].codeResult;
            let pageFormatCollector = document_barcode.codesByPageAndFormat[currentPage][codeResult.format];
            if (pageFormatCollector !== undefined
              && pageFormatCollector.indexOf(codeResult.code) !== -1)
              continue;

            if (document_barcode.codesByPage[currentPage].length === settings.resultOpts.maxCodesInPage) // page limit reached
              break;

            this.addResult(codeResult, document_barcode, currentPage, patch, scaled);
          }
        }
      }

      if (!hasResult) {
        if (this.env === 'DEV') {
          console.log("PAGE_" + currentPage + " when scaled " + scaled + " times with " + patch + " patch has no results.");
        }
      }
    }
  }

  addResult(codeResult, resultObj, page, patch, scale) {

    if (this.env === 'DEV') {
      console.log("Adding " + codeResult.code);
    }

    resultObj.codes.push(codeResult.code)
    resultObj.codesDetailed.push({
      code: codeResult.code,
      format: codeResult.format,
      page: page,
      scale: scale,
    })
    resultObj.codesByPage[page].push(codeResult.code)

    if (resultObj.codesByPageAndFormat[page][codeResult.format] === undefined) // this array helps to prevent same barcoodes in a page with same format to be collected
      resultObj.codesByPageAndFormat[page][codeResult.format] = [codeResult.code]
    else
      resultObj.codesByPageAndFormat[page][codeResult.format].push(codeResult.code)

    if (resultObj.codesByFormat[codeResult.format] === undefined) // this arr
      resultObj.codesByFormat[codeResult.format] = [codeResult.code]
    else
      resultObj.codesByFormat[codeResult.format].push(codeResult.code)

    resultObj.statsByPage[page].totalOnPatch[patch] += 1
    resultObj.statsByPage[page].totalOnScale[scale] += 1
    resultObj.stats.totalOnPatch[patch] += 1
    resultObj.stats.totalOnScale[scale] += 1
  }

  shuffle2Optimize(arr, first, type) {

    if (this.env === 'DEV') {
      console.log(type + ' order before smart shuffle')
      console.log(arr)
      console.log('Applying smart shuffle...')
    }

    let position = arr.indexOf(first)
    if (position === -1)
      return arr

    let ordered = []
    let myarrlen = arr.length
    let left = position
    let right = position

    ordered.push(first)
    while (ordered.length !== myarrlen) {
      left--
      right++
      if (left >= 0)
        ordered.push(arr[left])
      if (right < myarrlen)
        ordered.push(arr[right])
    }

    if (this.env === 'DEV') {
      console.log(type + ' order after shuffle...')
      console.log(ordered)
    }

    return ordered
  }

  copyobj(source, deep) {
    let o, prop, type
    if (typeof source != 'object' || source === null) {
      o = source
      return o
    }
    o = new source.constructor()
    for (prop in source) {

      if (source.hasOwnProperty(prop)) {
        type = typeof source[prop]

        if (deep && type === 'object' && source[prop] !== null) {
          o[prop] = this.copyobj(source[prop])

        } else {
          o[prop] = source[prop]
        }
      }
    }
    return o
  }

  initResult(currentPage, settings, result) {

    result.codesByPage[currentPage] = []
    result.codesByPageAndFormat[currentPage] = []

    result.statsByPage[currentPage] = {totalOnPatch: [], totalOnScale: []}

    let patches_len = settings.patches.length
    for (let i = 0; i < patches_len; i++) {
      result.statsByPage[currentPage].totalOnPatch[settings.patches[i]] = 0
      if (!result.stats.totalOnPatch.hasOwnProperty(settings.patches[i]))
        result.stats.totalOnPatch[settings.patches[i]] = 0
    }

    let scale_len = settings.scale.ordered.length
    for (let j = 0; j < scale_len; j++) {
      result.statsByPage[currentPage].totalOnScale[settings.scale.ordered[j]] = 0
      if (!result.stats.totalOnScale.hasOwnProperty(settings.scale.ordered[j]))
        result.stats.totalOnScale[settings.scale.ordered[j]] = 0
    }
  }

  parseResult(result, params) {

    result.success = true
    if (params.singlePage) {
      delete result.codesByPage
      delete result.statsByPage
      delete result.codesByPageAndFormat
      result.decodedPage = params.pageNr
    }
    return result
  }

  pageInRange(pdf, pageNr) {
    return pageNr >= 1 && pageNr <= pdf.numPages
  }

  decodeDocument(input, configs, final_call_back, page_printer) {
    this.decoder({
      input: input,
      singlePage: false,
      configs: configs,
      final_call_back: final_call_back,
      page_printer: page_printer,
    })
  }

  decodeSinglePage(input, pageNr, configs, final_call_back, page_printer) {
    this.decoder({
      input: input,
      singlePage: true,
      pageNr: pageNr,
      configs: configs,
      final_call_back: final_call_back,
      page_printer: page_printer,
    })
  }

  decoder(params) {

    const that = this
    const finalResults = {
      codes: [],
      codesDetailed: [],
      codesByPage: [],
      codesByFormat: [],
      codesByPageAndFormat: [],
      stats: {totalOnPatch: [], totalOnScale: []},
      statsByPage: [],
      success: false,
    }

    let settings = this.init(params.configs);
    if (this.env === 'DEV') {
      console.log('Initial settings...')
      console.log(settings)
    }

    let currentPage = 1
    // const zxingConfig = that.copyobj(settings.zxing);
    const quaggaconfig = that.copyobj(settings.quagga);

    PDFJS.disableWorker = true; // due to CORS
    PDFJS.getDocument(this.getDocumentUrl(params)).promise.then(function (pdf) {
      if (params.singlePage) {
        if (!that.pageInRange(pdf, params.pageNr)) {
          params.final_call_back({
            success: false,
            message: 'Given page is out of range! Valid page range is (1-' + pdf.numPages + ')'
          })   // PDF loading error
          return false
        } else
          currentPage = params.pageNr
      }

      getPage()

      function getPage() {
        if (that.env === 'DEV') {
          console.log('PAGE_' + currentPage + ' fetched...')
        }

        pdf.getPage(currentPage).then(async function (page) {
          if (that.env === 'DEV') {
            console.log('PAGE_' + currentPage + ' rendered...')
          }

          that.initResult(currentPage, settings, finalResults);
          const postPdfJsPageRender = function (canvas, scaled, scalingTime) {
            return new Promise(resolve => {
                const imginfo = that.getPageAsImg(canvas, scalingTime, settings.noisify)
                let patch_attempts = 0;
                const validPatches = that.getValidPatches(imginfo.processImg, settings) // due to quagga crash
                const postZXingDecode = function (result) {
                  that.setResult(
                    result,
                    finalResults,
                    currentPage,
                    validPatches[patch_attempts],
                    scaled,
                    settings
                  )
                  if (finalResults.codesByPage[currentPage].length < settings.resultOpts.maxCodesInPage) {
                    patch_attempts++
                    if (patch_attempts < validPatches.length) {
                      if (that.env === 'DEV') {
                        console.log('Deconding Document ZXing')
                      }
                      that.codeReader
                        .decodeFromImage(
                          undefined,
                          that.getConfigs(imginfo.processImg, validPatches[patch_attempts], quaggaconfig).src
                        )
                        .then((result) => {
                          const res = {
                            codeResult: {
                              code: result.text,  // the decoded code as a string
                              format: 'pdf_417', // or code_39, codabar, ean_13, ean_8, upc_a, upc_e
                              ...result
                            },
                          }
                          if (that.env === 'DEV') {
                            console.log(res)
                          }
                          postZXingDecode(res)
                        })
                        .catch((error) => {
                          if (error instanceof NotFoundException) {
                            postZXingDecode('No MultiFormat Readers were able to detect the code.')
                            if (that.env === 'DEV') {
                              console.log('No MultiFormat Readers were able to detect the code.')
                            }
                          } else {
                            if (that.env === 'DEV') {
                              console.log(error);
                            }
                            postZXingDecode(error)
                          }
                        })
                      /*
                      Quagga.decodeSingle(
                        that.getConfigs(imginfo.processImg, validPatches[patch_attempts], quagaconfigs),
                        postZXingDecode
                      )
                       */
                      return false
                    } else {
                      return resolve({
                        isDone: false,
                        message: "PAGE_" + currentPage +
                          " | Max number of tries (with valid patches) to find a barcode on page was reached!"
                      });
                    }
                  } else
                    return resolve({
                      isDone: true,
                      patch: validPatches[patch_attempts],
                      message: 'PAGE_' + currentPage +
                        ' | Count of barcodes requested was reached!'
                    }) // send 1 to stop scaling loop
                };

                if (params.page_printer !== undefined && scalingTime === 1)
                  params.page_printer(imginfo.printImg, currentPage, scaled)

                if (validPatches.length > 0) {
                  if (that.env === 'DEV') {
                    console.log("Deconding Single ZXing");
                  }
                  that.codeReader
                    .decodeFromImage(
                      undefined,
                      that.getConfigs(imginfo.processImg, validPatches[patch_attempts], quaggaconfig).src
                    )
                    .then((result) => {
                      const res = {
                        codeResult: {
                          code: result.text,  // the decoded code as a string
                          format: 'pdf_417', // or code_39, codabar, ean_13, ean_8, upc_a, upc_e
                          ...result
                        },
                      }
                      postZXingDecode(res)
                    })
                    .catch((error) => {
                      if (error instanceof NotFoundException) {
                        postZXingDecode('No MultiFormat Readers were able to detect the code.')
                        if (that.env === 'DEV') {
                          console.log("No MultiFormat Readers were able to detect the code.");
                        }
                      } else {
                        if (that.env === 'DEV') {
                          console.log(error);
                        }
                        postZXingDecode(error)
                      }
                    })
                  /*
                  Quagga.decodeSingle(
                    that.getConfigs(imginfo.processImg, validPatches[patch_attempts], quagaconfigs),
                    postZXingDecode
                  )
                   */
                } else {
                  return resolve({
                    isDone: false,
                    message: 'No valid patch was found!',
                  })
                }
              }
            )
          }

          // scale pages (as images) in given range
          let scale_len = settings.scale.ordered.length
          for (let i = 0; i < scale_len; i++) {
            const scaled = settings.scale.ordered[i]
            const viewport = page.getViewport({scale: scaled})
            const canvas = that.getCanvas(viewport)
            const scalingTime = i + 1

            if (that.env === 'DEV') {
              console.log('PAGE_' + currentPage + ' scaling ' + scaled + ' times.')
            }

            let result = await page.render({
              canvasContext: canvas.getContext('2d'),
              viewport: viewport,
            }).promise.then(() => postPdfJsPageRender(canvas, scaled, scalingTime))

            if (result.isDone) {
              if (that.env === 'DEV') {
                console.log("PAGE_ " + currentPage + " was finished! Stopping the loop of scale! (on scale " + scaled + ")");
              }

              if (settings.improve) {
                settings.patches = that.shuffle2Optimize(settings.patches, result.patch, 'Patch')
                settings.scale.ordered = that.shuffle2Optimize(settings.scale.ordered, scaled, 'Scale')
              }
              break
            } else {
              if (that.env === 'DEV') {
                console.log(result);
              }
            }
          }

          if (!params.singlePage && currentPage < pdf.numPages) {
            currentPage++
            getPage()
          } else
            params.final_call_back(that.parseResult(finalResults, params))
        })
      }
    }, function (reason) {
      params.final_call_back({success: false, message: reason.message})   // PDF loading error
    })
  }

  getValidPatches(img, settings) {

    function checkPatchValidity(img, patchSize, half) {

      function _computeDivisors(n) {
        let largeDivisors = [], divisors = [], i

        for (i = 1; i < Math.sqrt(n) + 1; i++) {
          if (n % i === 0) {
            divisors.push(i);
            if (i !== n / i) {
              largeDivisors.unshift(Math.floor(n / i))
            }
          }
        }
        return divisors.concat(largeDivisors)
      }

      function _computeIntersection(arr1, arr2) {
        let i = 0,
          j = 0,
          result = []

        while (i < arr1.length && j < arr2.length) {
          if (arr1[i] === arr2[j]) {
            result.push(arr1[i])
            i++
            j++
          } else if (arr1[i] > arr2[j]) {
            j++
          } else {
            i++
          }
        }
        return result
      }

      function calculatePatchSize(patchSize, imgSize) {
        let divisorsX = _computeDivisors(imgSize.x)
        let  divisorsY = _computeDivisors(imgSize.y)
        let  wideSide = Math.max(imgSize.x, imgSize.y)
        let  common = _computeIntersection(divisorsX, divisorsY)
        let  nrOfPatchesList = [8, 10, 15, 20, 32, 60, 80]
        let  nrOfPatchesMap = {
            'x-small': 5,
            'small': 4,
            'medium': 3,
            'large': 2,
            'x-large': 1
          }
          let nrOfPatchesIdx = nrOfPatchesMap[patchSize] || nrOfPatchesMap.medium
          let nrOfPatches = nrOfPatchesList[nrOfPatchesIdx]
          let desiredPatchSize = Math.floor(wideSide / nrOfPatches)
          let optimalPatchSize

        function findPatchSizeForDivisors(divisors) {
          let i = 0
          let found = divisors[Math.floor(divisors.length / 2)]

          while (i < divisors.length - 1 && divisors[i] < desiredPatchSize) {
            i++
          }
          if (i > 0) {
            if (Math.abs(divisors[i] - desiredPatchSize) > Math.abs(divisors[i - 1] - desiredPatchSize)) {
              found = divisors[i - 1]
            } else {
              found = divisors[i]
            }
          }
          if (desiredPatchSize / found < nrOfPatchesList[nrOfPatchesIdx + 1] / nrOfPatchesList[nrOfPatchesIdx] && desiredPatchSize / found > nrOfPatchesList[nrOfPatchesIdx - 1] / nrOfPatchesList[nrOfPatchesIdx]) {
            return {x: found, y: found}
          }
          return null;
        }

        optimalPatchSize = findPatchSizeForDivisors(common)
        if (!optimalPatchSize) {
          optimalPatchSize = findPatchSizeForDivisors(_computeDivisors(wideSide))
          if (!optimalPatchSize) {
            optimalPatchSize = findPatchSizeForDivisors(_computeDivisors(desiredPatchSize * nrOfPatches))
          }
        }
        return optimalPatchSize
      }


      var size = {}
      if (half)
        size = {x: img.width / 2, y: img.height / 2}
      else
        size = {x: img.width, y: img.height}

      let calculated_patch_size = calculatePatchSize(patchSize, size)
      if (calculated_patch_size.x * calculated_patch_size.y * 3 > 65536 || ((calculated_patch_size.x * calculated_patch_size.y * 3) + calculated_patch_size.x * calculated_patch_size.y) > 65536)
        return false
      return true
    }

    let valid_patches = []
    let patches_len = settings.patches.length
    for (let i = 0; i < patches_len; i++) {
      if (checkPatchValidity(img, settings.patches[i], settings.quagga.locator.halfSample))
        valid_patches.push(settings.patches[i])
    }
    return valid_patches

  }
}
