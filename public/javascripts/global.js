var orderListData = [];

(function(){
	populateTable();
	$('#btnAddRecord').on('click', addRecord);
	$('#btnAddTime').on('click', addTime);
	$('#orderList table tbody').on('click', 'td button.linkdeleterecord', deleteRecord);



function populateTable(){
	var tableContent = '';

	$.getJSON('/orderlist', function(data){
		orderListData = data;
		$.each(data, function(){
			tableContent += '<tr>';
			console.log('1:'+this.done1+' ,2: '+ this.done2);
			if(!this.done1){
		    	tableContent += '<td><input  position="1" id= "' + this._id + '" type="text" class="input-medium search-query" value = "' + this.username1 + '"><span></span></td>';
		    }else{
		    	tableContent += '<td><span>' + this.username1 + '</span></td>';
		    }
		    if(!this.done2){
		    	tableContent += '<td><input  position="2" id= "' + this._id + '" type="text" class="input-medium search-query" value = "' + this.username2 + '"><span></span></td>';
		    }else{
		    	tableContent += '<td><span>' + this.username2 + '</span></td>';
		    }
		    if(this.exeTime < 0){
		    	tableContent += '<td>' + this.exeTime + '</td>';
			}else{
				tableContent += '<td>' + this.exeTime + '</td>';
			}
		    tableContent += '<td><button type="button" class="linkdeleterecord btn btn-default btn-lg" rel="' + this._id + '">delete</a></td>';
		    tableContent += '</tr>';
		});
		$('#orderList table tbody').html(tableContent);
		$('#orderList table tbody').find('input').toArray()[0].focus();
	});
};

$('#orderList').on('keyup','input', function(c){
	if(c.which === 13){
		//console.log("fjasldfjklsadjf");
		var done = $(this);
		var id = done.attr('id');
		var parent = done.parents('td');
		var name1;
		var name2;
		parent.find('span').text(done.val());
		//done.removeClass('pending');
		$(this).hide();
		/*if($(this).attr('position') === '1'){
			//first player
			reviseName(0, done.val(), id);
		}else*/ 
		if($(this).attr('position') === '2'){
			//second player
			//console.log(done.parents('tr').find('td').toArray());
			done.parents('tr').find('td').each(function(){
				//console.log($(this).find('input').attr('id'));
				//console.log($(this).find('input').attr('position'));
				
				if($(this).find('input').attr('id') === id && $(this).find('input').attr('position') === '1'){
					name1 = $(this).find('span').text();
				}
			});
			name2 = done.val();
			//console.log('1: '+name1 +' , 2: '+name2);
			reviseName(name1, name2, id);
		}
	}
});

function reviseName(name1, name2, id){
	var Data = {
		'id': id,
		'username1': name1,
		'username2': name2,
		'done1': true,
		'done2': true
	}
	//Data['done'][pos] = true;
	$.ajax({
		type:'POST',
		data: Data,
		url: '/revisedata',
		dataType: 'JSON'
	}).done(function(response){
		if(response.msg === ''){
			console.log('fuck');
		}else{
			alert('Error: ' + response.msg);
		}
	});
	populateTable();
};

function checkDone(id){

};

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
			'exeTime': Number($('#addTime fieldset input#inputExeTime').val()),
			'done1': false, 
			'done2': false
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
			'exeTime': Number(-1),
			'done1': false,
			'done2': false
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