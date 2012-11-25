<g:set var="comments" value="${commentable.comments}"></g:set>
<div id="comments" class="commentable">
	<g:render template="/commentable/comment" 
			  collection="${comments}" 
			  var="comment" 
			  plugin="commenter"
			  model="[noEscape:noEscape]" />
</div>
<div id="addComment" class="addComment">
	<h2 class="addCommentTitle">
		<a href="#commentEditor" onclick="show_comment_container()">
			<g:message code="comment.add.title" default="Post a Comment"></g:message>
		</a>
	</h2>
	<div id="addCommentContainer" class="addCommentContainer">
		<div class="addCommentDescription">
			<g:message code="comment.add.description" default=""></g:message>
		</div>
		<a name="commentEditor"></a>
		<g:formRemote name="addCommentForm" url="[controller:'commentable',action:'add']" update="comments" after="post_comment()">
			<plugin:isNotAvailable name="grails-ui">
				<g:textArea id="commentBody" name="comment.body" /> <br />
			</plugin:isNotAvailable>
			<g:hiddenField name="update" value="comments" />			
			<g:hiddenField name="commentLink.commentRef" value="${commentable.id}" />
			<g:hiddenField name="commentLink.type" value="${commentable.class.name}" />			
			<g:hiddenField name="commentPageURI" value="${request.forwardURI}"></g:hiddenField>
			<g:submitButton name="${g.message(code:'comment.post.button.name', 
											 'default':'Post')}"></g:submitButton>
		</g:formRemote>
	</div>
</div>


<g:javascript>

    $(function() {
        post_comment();
    });

    function post_comment() {
        $('#addCommentContainer').hide();
    }


    function show_comment_container() {
        $('#commentBody').attr({value: ''})
        $('#addCommentContainer').show();
    }


</g:javascript>