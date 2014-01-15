/****************************************************************************************************
 * 
 * Small Widget to do Small Statistics Calculations
 *
 */

$(document).ready(function() {
  population.init();
  absignificance.init();
})


population = {
  init: function() {
    // Enable
    $('input[type=radio], select', '#population').on('change', this.calculate);
    $('input[type=text]', '#population').on('input', this.calculate);
    this.calculate();
  },
  
  calculate: function() {
    // source: http://www.surveysystem.com/sscalc.htm
    var out = 0;
    var z = 0;
    var confidence = parseInt($('input[name=population-confidence]:checked', '#population').val());
    var margin = parseFloat($('select[name=population-margin]', '#population').val());
    var population = parseInt($('input[name=population-size]', '#population').val());
    
    // *** Calculate
    if (confidence == 95) {
      z = 1.96;
    } else if (confidence == 96) {
      z = 2.05;
    } else if (confidence == 97) {
      z = 2.17;
    } else if (confidence == 98) {
      z = 2.33;
    } else if (confidence == 99) {
      z = 2.58;
    }
    
    if (confidence > 0 && margin > 0) {
      out = ((z * z) * 0.25) / ((margin / 100) * (margin / 100));
      
      if (population > 0) {
        out = out / (1 + (out - 1) / population);
      }
    }
    out = parseInt(out + 0.5);
    
    // *** Return
    $('.result', '#population').html(out);
  } 
}


absignificance = {
  init: function() {
    // Enable
    $('input[type=text]', '#absignificance').on('input', this.calculate);
    this.calculate();
  },
  
  calculate: function() {
    // source: http://getdatadriven.com/ab-significance-test
    var out = 0;
    var DECIMALS = 100;
    var a = {
      size: parseInt($('input[name=absignificance-asize]', '#absignificance').val()),
      conversions: parseInt($('input[name=absignificance-aconversions]', '#absignificance').val()),
      ratio: 0,
      percentage: 0
    }
    var b = {
      size: parseInt($('input[name=absignificance-bsize]', '#absignificance').val()),
      conversions: parseInt($('input[name=absignificance-bconversions]', '#absignificance').val()),
      ratio: 0,
      percentage: 0
    }
    var improvement = 0;
    var significance = 0;
    
    // *** Calculate
    if (a.size > 0 && a.conversions >= 0) a.ratio = a.conversions / a.size;
    if (b.size > 0 && b.conversions >= 0) b.ratio = b.conversions / b.size;
    
    if (a.size > 0 && a.conversions >= 0 && b.size > 0 && b.conversions >= 0) {
      // Improvement
      improvement = (b.ratio - a.ratio) / a.ratio;
      
      // Significance
      var sa = Math.sqrt(a.ratio * (1 - a.ratio) / a.size);
      var sb = Math.sqrt(b.ratio * (1 - b.ratio) / b.size);
      var s = (a.ratio - b.ratio) / Math.sqrt(Math.pow(sa, 2) + Math.pow(sb, 2));
      var r = 0;
      if (a.ratio > b.ratio) {
        r = jstat.pnorm(s, 0, 1, null, null);
      } else {
        r = 1 - jstat.pnorm(s, 0, 1, null, null);
      }
      significance = r;
    }
    a.percentage = Math.round(a.ratio * 100 * DECIMALS) / DECIMALS;
    b.percentage = Math.round(b.ratio * 100 * DECIMALS) / DECIMALS;
    improvement = Math.round(improvement * 100 * DECIMALS) / DECIMALS;
    significance = Math.round(significance * 100 * DECIMALS) / DECIMALS;
    
    // *** Return
    $('.result-apercentage', '#absignificance').html(a.percentage + '%');
    $('.result-bpercentage', '#absignificance').html(b.percentage + '%');
    $('.result', '#absignificance').html(improvement + '%');
    $('.result-significance', '#absignificance').html(significance + '%');
  }
}



