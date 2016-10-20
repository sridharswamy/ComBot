package selenium.tests;

import static org.junit.Assert.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;


import io.github.bonigarcia.wdm.ChromeDriverManager;
import org.junit.FixMethodOrder;
import org.junit.runners.MethodSorters;


@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class BotTest
{
	
	private static String id = "sadoshi@ncsu.edu";
	private static String pwd = "****";
	private static WebDriver driver;
	
	@BeforeClass
	public static void setUp() throws Exception 
	{
		
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
		driver.get("https://seteamhq.slack.com/");
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));
		
		email.sendKeys(id);
		pw.sendKeys(pwd);
		
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();
		
		wait.until(ExpectedConditions.titleContains("general"));
		
	}
	
	
	
	
	@AfterClass
	public static void  tearDown() throws Exception
	{
		driver.close();
		driver.quit();
	}

	
	@Test
	public void fetch_url() throws Exception
	{
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		
		driver.get("https://seteamhq.slack.com/messages/testing");
		wait.until(ExpectedConditions.titleContains("testing"));

		// Type something. F
		WebElement messageBot = driver.findElement(By.id("message-input"));
		
		//fetch repository details
		messageBot.sendKeys("fetch https://github.com/siddoshi93/mockrepo ");
		messageBot.sendKeys(Keys.RETURN);
		
		wait.withTimeout(4, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		

		WebElement chat = null;
		// we get last message body
		
		
		int attempts = 3;
		while(attempts -- >0)
		{	
			try{
			     chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));			
			}
			catch(org.openqa.selenium.StaleElementReferenceException ex)
			{
			    chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));
			}
		
		}
		
		//check if we get it null
		assertNotNull(chat);
		
		//success message
		String msg = "Fetching commit history from the repo";
		String rep = chat.getText();
		
		//System.out.println(rep);
		
		// check if the message contains the success message
		boolean val = rep.indexOf(msg)!=-1;
		assertTrue(val);	
	}
	
	@Test
	public void recent_commit() throws Exception
	{
		WebDriverWait wait = new WebDriverWait(driver, 30);
		
		driver.get("https://seteamhq.slack.com/messages/testing");
		wait.until(ExpectedConditions.titleContains("testing"));

		// get recent commits
		WebElement messageBot = driver.findElement(By.id("message-input"));
		messageBot.sendKeys("file file1 recent 2");
		messageBot.sendKeys(Keys.RETURN);
		
		wait.withTimeout(10, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		
		WebElement chat = null;
		
		int attempts = 10;
		while(attempts-- >0)
		{	
			try{
			     chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));
				
			}
			catch(org.openqa.selenium.StaleElementReferenceException ex)
			{
			    chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));
				
			}
		
		}
		 // check if reply is null
		assertNotNull(chat);
		
		String msg = "Sorry, I couldn't locate that file!";
		String rep = chat.getText();
		boolean val = rep.indexOf(msg)==-1;
		
		assertTrue(val);
		
		String reps[] = rep.split("\n");
		int n = reps.length;	
		
		String repbot[] = {"snswamy@ncsu.edu: Wed Oct 19 2016 22:49:58 GMT-0400 (EDT)","siddoshi93@gmail.com: Wed Oct 19 2016 22:46:30 GMT-0400 (EDT)"};		
	
		System.out.println(rep);
		//check if number is equal to number of committers required
		assertTrue(n-2==repbot.length);
		
		int i=0;
		while(i<repbot.length)
		{
			val = reps[i+2].indexOf(repbot[i])!=-1;
			assertTrue(val);
			i++;
		}
		
	}
	
	
	

	@Test
	public void top_commit() throws Exception
	{
		WebDriverWait wait = new WebDriverWait(driver, 30);
		
		
		// Type something
		WebElement messageBot = driver.findElement(By.id("message-input"));
		messageBot.sendKeys("file file1 top 2");
		messageBot.sendKeys(Keys.RETURN);
		
		wait.withTimeout(10, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		
		WebElement chat = null;
		
		int attempts = 10;
		while(attempts-- >0)
		{	
			try{
			     chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));
				
			}
			catch(org.openqa.selenium.StaleElementReferenceException ex)
			{
			    chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));
				
			}
		
		}
		
		
		assertNotNull(chat);
		
		String msg = "Sorry, I couldn't locate that file!";
		String rep = chat.getText();
		boolean val = rep.indexOf(msg)==-1;
		System.out.println(rep);
		assertTrue(val);
		
		String reps[] = rep.split("\n");
		int n = reps.length;	 
		
		String repbot[] = {"siddoshi93@gmail.com: 2 commits","snswamy@ncsu.edu: 1 commits"};
		
		System.out.println(n);
		
		//check if number is equal to number of committers required
		assertTrue(n-2==repbot.length);
		
		int i=0;
		while(i<repbot.length)
		{

			val = reps[i+2].indexOf(repbot[i])!=-1;
			assertTrue(val);
			i++;
		}
	}
	

}
