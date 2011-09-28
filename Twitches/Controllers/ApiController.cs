using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ServiceStack.Redis;
using ServiceStack.Text;

namespace Twitches.Controllers
{
	public class ApiController : Controller
	{
		private readonly RedisClient _Client;

		public ApiController(RedisClient client)
		{
			_Client = client;
		}

		public ActionResult GetMessages(string channel)
		{
			var messages = _Client.GetRangeFromList(channel, 0, 10);
			return Serialize(new GetMessagesResult(messages.Select(d => new Message(d)).ToArray()));
		}

		public ActionResult SendMessage(string channel, string message)
		{
			_Client.PushItemToList(channel, message);
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