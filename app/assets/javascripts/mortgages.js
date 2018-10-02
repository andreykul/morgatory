$(function() {
  $('input[name=asking_price]').focus();
  setTimeout(function() {
    $('input[name=asking_price]').blur();
  }, 1)
  $('input[name=asking_price], input[name=down_payment_amount], input[name=down_payment_percent]').focusout(function(e){
    var price = parse_currency($('input[name=asking_price]').val());
    var dpPercent = parse_currency($('input[name=down_payment_percent]').val());
    var dpAmount = parse_currency($('input[name=down_payment_amount]').val());
    if (e.target.name === 'down_payment_amount') {
      $('input[name=down_payment_percent]').val(e.target.value / price * 100);
    } else if (e.target.name === 'down_payment_percent') {
      dpAmount = price * e.target.value / 100;
    } else {
      dpAmount = dpPercent / 100 * e.target.value;
    }
    $('input[name=asking_price]').val(number_to_currency(price));
    $('input[name=down_payment_amount]').val(number_to_currency(dpAmount));
    
    var requiredAmount = price - dpAmount;
    var cmhcAmount = 0;
    if (dpPercent >= 20)
      cmhcAmount = 0;
    else if (dpPercent >= 15)
      cmhcAmount = requiredAmount * 0.028;
    else if (dpPercent >= 10)
      cmhcAmount = requiredAmount * 0.031;
    else if (dpPercent >= 5)
      cmhcAmount = requiredAmount * 0.04;

    $('input[name=cmhc_amount]').val(number_to_currency(cmhcAmount));
    $('input[name=mortgage_amount]').val(number_to_currency(requiredAmount + cmhcAmount));
    updateMonthlyPayment();
  });

  function updateMonthlyPayment() {
    var p = parse_currency($('input[name=mortgage_amount]').val());
    var r = +($('input[name=interest_rate]').val() / 100 / 12).toFixed(6);
    if (p > 0 && r > 0) {
      var n = $('input[name=amortization]').val() * 12;
      var c = Math.pow(1 + r, n).toFixed(6);
      var lastPart = (r*c/(c - 1)).toFixed(6);

      $('input[name=monthly_payment]').val(number_to_currency(p*lastPart));
    }
  }

  $('input[name=interest_rate], input[name=amortization]').focusout(updateMonthlyPayment);

  $('input[name=asking_price], input[name=down_payment_amount]').focus(function(e) {
    if (e.target.value)
      $(e.target).val(parse_currency(e.target.value));
  })
})