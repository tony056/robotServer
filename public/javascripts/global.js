var orderListData = [];

(function(){
	populateTable();
	$('#btnAddRecord').on('click', addRecord);
	$('#btnAddTime').on('click', addTime);
	$('#orderList table tbody').on('click', 'td a.linkdeleterecord', deleteRecord);



function populateTable(){
	var tableContent = '';

	$.getJSON('/orderlist', function(data){
		orderListData = data;
		$.each(data, function(){
			tableContent += '<tr>';
		    tableContent += '<td><input type="text" class="pending" value = "' + this.username1 + '"><span></span></td>';
		    tableContent += '<td><input type="text" class="pending" value = "' + this.username2 + '"><span></span></td>';
		    tableContent += '<td>' + this.exeTime + '</td>';
		    tableContent += '<td><a href="#" class="linkdeleterecord" rel="' + this._id + '">delete</a></td>';
		    tableContent += '</tr>';
		});
		$('#orderList table tbody').html(tableContent);
		//$('.hide').hide();
	});
};

$('#orderList').on('keyup','input', function(c){
	if(c.which === 13){
		//console.log("fjasldfjklsadjf");
		var done = $(this);
		var parent = done.parents('td');
		parent.find('span').text(done.val());
		done.removeClass('pending');
		$(this).hide();

	}
});

function addTime(event){
	event.preventDefault();
	var errorCount = 0;
	var defaultName = 'you';
	$('#addTime input').each(function(index, val){
		if($(this).val() === ''){
			errorCount++;
		}
	});
	if(errorCount === 0){
		//JSON newTime = new JSON();
		var newTime = {
			'username1': defaultName,
			'username2': defaultName,
			'exeTime': Number($('#addTime fieldset input#inputExeTime').val())
		}
		$.ajax({
			type: 'POST',
			data: newTime,
			url: '/addrecord',
			dataType: 'JSON'
		}).done(function(response){
			if(response.msg === ''){
				$('#addTime fieldset input#inputExeTime').val('');
				populateTable();
			}else{
				alert('Error: ' + response.msg);
			}
		})
	}else{
		alert('Please fill in all fields');
    	return false;
	}
};

function addRecord(event){
	event.preventDefault();
	var errorCount = 0;
	$('#addRecord input').each(function(index, val){
		if($(this).val() === ''){
			errorCount++;
		}
	});

	if(errorCount === 0){
		var newRecord = {
			'username1': $('#addRecord fieldset input#inputUserName1').val(),
			'username2': $('#addRecord fieldset input#inputUserName2').val(),
			'exeTime': Number(-1)
		}
		//newRecord['exeTime'] = parseInt(newRecord['exeTime'], 10);
		$.ajax({
			type: 'POST',
			data: newRecord,
			url: '/addrecord',
			dataType: 'JSON'
		}).done(function(response){
			if(response.msg === ''){
				$('#addRecord fieldset input').val('');
				populateTable();
			}else{
				alert('Error: ' + response.msg);
			}
		});
	}else{
		alert('Please fill in all fields');
    	return false;
	}
};

function deleteRecord(event) {

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this record?');

  // Check and make sure the user confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/deleterecord/' + $(this).attr('rel')
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      // Update the table
      populateTable();

    });

  }
  else {

    // If they said no to the confirm, do nothing
    return false;

  }

};

}());