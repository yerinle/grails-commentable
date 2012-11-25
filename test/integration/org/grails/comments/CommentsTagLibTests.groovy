package org.grails.comments

import grails.test.*
import grails.test.mixin.web.GroovyPageUnitTestMixin
import org.junit.Ignore

class CommentsTagLibTests extends GroovyPagesTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testEachComment() {

		def poster = new TestPoster(name:"fred")
		poster.save()

		def entry = new TestEntry(title:"The Entry")
		shouldFail(CommentException) {
			entry.addComment(poster, "My comment")
		}

		entry.save()

		entry.addComment poster, "one."
		entry.addComment poster, "two."
		
		def template = '<comments:each bean="${bean}">${comment.body}</comments:each>'
		
		assertOutputEquals "one.two.", template, [bean:entry]
		
		template = '<comments:each bean="${null}">${comment.body}</comments:each>'
		
		assertOutputEquals "", template, [bean:entry]		
    }


	void testEachRecent() {
        def poster = new TestPoster(name: "fred")
        poster.save()
        def entry = new TestEntry(title: "The Entry")
        shouldFail(CommentException) {
            entry.addComment(poster, "My comment")
        }
        entry.save()
        entry.addComment poster, "one."
        entry.addComment poster, "two."

        def template = '<comments:eachRecent domain="${domain}">${comment.body}</comments:eachRecent>'
        assertOutputEquals "two.one.", template, [domain:TestEntry]
    }

    @Ignore
    void testRender() {
        def poster = new TestPoster(name: "fred")
        poster.save()
        def entry = new TestEntry(title: "The Entry")
        shouldFail(CommentException) {
            entry.addComment(poster, "My comment")
        }
        entry.save()
        entry.addComment poster, "one."
        entry.addComment poster, "two."

        def template = '<comments:render bean="${domain}" />'
        assertOutputEquals "two.one.", template, [domain:TestEntry]
    }


}
