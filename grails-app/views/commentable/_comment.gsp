<div id="comment${comment.id}" class="comment">
    %{--<div class='permalink'>--}%
    %{--<a href="#comment_${comment.id}" name="comment_${comment.id}">--}%
    %{--<g:message code="comment.link.text" default="link"></g:message>--}%
    %{--</a>--}%
    %{--</div>--}%

    %{--<plugin:isAvailable name="avatar">--}%
    %{--<div class="avatar">	--}%
    %{--<avatar:gravatar cssClass="commentAvatar" size="50"--}%
    %{--email="${comment?.poster.email}" gravatarRating="R"--}%
    %{--defaultGravatarUrl="${createLinkTo(absolute: true, dir:'/images',file:'grails-icon.png')}"/>--}%
    %{--</div>			--}%
    %{--</plugin:isAvailable>--}%

    <div class="commentDetails">
        <strong>${comment?.poster}</strong> on  <g:formatDate format="MMM dd, yyyy" date="${comment.dateCreated}"/>
    </div>

    <div class='commentBody'>
        <g:if test="${noEscape}">
            ${comment?.body}
        </g:if>
        <g:else>
            ${comment?.body?.encodeAsHTML()}
        </g:else>
    </div>

</div>
