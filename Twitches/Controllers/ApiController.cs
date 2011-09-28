using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BookSleeve;
using ServiceStack.Text;

namespace Twitches.Controllers
{
	public class ApiController : Controller
	{
		private readonly RedisConnection _Connection;

		public ApiController(RedisConnection connection)
		{
			_Connection = connection;
		}

		public ActionResult GetMessages(string channel)
		{
			var messages = _Connection.Lists.RangeString(1, channel, 0, 10);
			return Serialize(new GetMessagesResult(_Connection.Wait(messages).Select(d => new Message(d)).ToArray()));
		}

		public ActionResult SendMessage(string channel, string message)
		{
			_Connection.Lists.AddFirst(1, channel, message);
			return Serialize(new SendMessageResult(true));
		}

		public ActionResult Serialize<T>(T o)
		{
			return Content(JsonSerializer.SerializeToString<T>(o), "application/json");
		}
	}

	public class GetMessagesResult
	{
		public Message[] messages { get; set; }

		public GetMessagesResult(Message[] messages)
		{
			this.messages = messages;
		}
	}

	public class Message
	{
		public string text { get; set; }

		public Message(string text)
		{
			this.text = text;
		}
	}

	public class SendMessageResult
	{
		public bool ok { get; set; }

		public SendMessageResult(bool ok)
		{
			this.ok = ok;
		}
	}
}