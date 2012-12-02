<%@ page import="grails.util.GrailsNameUtils" %>
<g:set var="comments" value="${commentable.comments}"></g:set>
<g:set var="commentBean" value="${commentable}"/>
<div id="comments" class="commentable">
    <g:render template="/commentable/comment"
              collection="${comments}"
              var="comment"
              plugin="commenter"
              model="[noEscape: noEscape]"/>
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

        <div id="${id}_comment_rating" class="star_comment_rating">
            <g:formRemote name="${id}_form" class="star_rating"
                      url="[controller: 'rateable', action: 'rate', id: commentable.id, params: [type: type]]" title="${average}">
                <select name="rating" id="${id}_select">
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                </select>
                <input id="${id}_active" name='active' type="hidden" value="true"/>
                <input type="submit" value="Submit Rating"/>
            </g:formRemote>
        </div>

        <g:formRemote name="addCommentForm" url="[controller: 'commentable', action: 'add']" update="comments"
                      after="post_comment()" before="add_rating()">
            <g:textArea id="commentBody" name="comment.body"/> <br/>
            <g:hiddenField name="comment.stars" id="commentStars"/>
            <g:hiddenField name="update" value="comments"/>
            <g:hiddenField name="commentLink.commentRef" value="${commentable.id}"/>
            <g:hiddenField name="commentLink.type" value="${commentable.class.name}"/>
            <g:hiddenField name="commentPageURI" value="${request.forwardURI}"></g:hiddenField>
            <g:submitButton name="${g.message(code: 'comment.post.button.name',
                    'default': 'Post')}"></g:submitButton>
        </g:formRemote>
    </div>
</div>

<style>

</style>


<g:javascript>

        $(function () {
            post_comment();
        });

        function add_rating() {
            $('#commentStars').attr('value', $('#star_select').attr('value'))
        }

        function post_comment() {
            $('#addCommentContainer').hide();
            $('#addCommentContainer > div .star > span').removeClass('active');
        }


        function show_comment_container() {
            $('#commentBody').attr({value: ''})
            $('#addCommentContainer').show();
        }


</g:javascript>