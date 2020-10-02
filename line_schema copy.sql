DROP DATABASE IF EXISTS `wipSchema`;
CREATE DATABASE `wipSchema`; 
USE `wipSchema`;

SET NAMES utf8 ;
SET character_set_client = utf8mb4 ;

-- table to store venue info
CREATE TABLE `venue` (
  `venue_uid` int(11) NOT NULL AUTO_INCREMENT,
  `venue_name` varchar(50) NOT NULL,
  `venue_id` int,
  `category` varchar(50) DEFAULT NULL,
  `max_cap` int(5) default 2,
  `current_cap` int(5) default 0,
  `queue_head` int(5) default 0,
  `current_token` int(5) DEFAULT 0,
  `business_hours` json default null,
  `street` varchar(250) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `state` varchar(250) DEFAULT NULL,
  `zip` VARCHAR(12) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `latitude`varchar(190) NOT NULL,
  `longitude` varchar(190) NOT NULL,
  `default_time_spent` time not null default '00:02:00',
  PRIMARY KEY (`venue_uid`)
);

-- table to store customer info
CREATE TABLE `customer` (
  `customer_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `current_long` double default null,
  `current_lat` double default null,
  PRIMARY KEY (`customer_id`)
);
-- Ticket table used to create tikets allocating customers to venues
CREATE TABLE `ticket`(
	`ticket_id` int(11) NOT NULL AUTO_INCREMENT,
	`user_id` int(11) NOT NULL,
    `venue_uid` int(11) NOT NULL,
    `token_number` int(11) NOT NULL,
    `ticket_created_at` DATETIME,
    `approx_entry` time not null,
    `entry_time` time not null,
    `exit_time` time default null,
    `duration` time default null,
    `leaving` time default null,
	`status` varchar(50) default 'waiting',
    PRIMARY KEY (`ticket_id`),
    Foreign key(`user_id`) references `customer` (`customer_id`) ON DELETE CASCADE,
	Foreign key(`venue_uid`) references `venue` (`venue_uid`) ON DELETE CASCADE
);

DELIMITER $$

-- Stored function to allocated an id to a particular venue. If the venue already exists, allocate the same give id to the venue with the different location.
-- If a venue is new, null is passed and a new unique value is allocated to it.  
CREATE FUNCTION autoInc (id int)
    RETURNS INT(10)
    BEGIN
        
		DECLARE getID INT(10);
        DECLARE getVenueIdToReturn INT(10);
        -- get the last inserted max value allocated to venues. This last inserted id +1 will be the unique id to the venue given that this venue does not already exists in the database
         SET getID = (select last_insert_id(venue_id) from venue order by venue_id DESC limit 1);
			-- edge case to cover if there is no venue currently in the database, then the venue id will be 1
			if id is null and getID is null then
				SET getVenueIdToReturn = (1);
			-- To handle the request to add the existing venue but for a different location
			elseif id is null and getID is not null then
				SET getVenueIdToReturn = (getID)+1;
			else
				SET getVenueIdToReturn = id;
			end if;
        RETURN getVenueIdToReturn;
    END$$
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE CreateVenue(
  v_name varchar(50),
  v_id int,
  v_category varchar(50),
  v_max_cap int(5),
  v_current_cap int(5),
  v_queue_head int(5),
  v_business_hours json,
  v_email varchar(50),
  v_default_time_spent time,
  a_street varchar(250),
  a_city VARCHAR(100),
  a_state VARCHAR(250),
  a_zip VARCHAR(12),
  a_phone VARCHAR(50),
  a_lattitude VARCHAR(190),
  a_longitude VARCHAR(190)
)


BEGIN    
    START TRANSACTION;
    -- Insert account data
    -- autoInc(id) stored function is used to enter new or existing venues
    INSERT into venue(venue_name, venue_id, category, max_cap, current_cap, queue_head, business_hours, email, street, city, state, zip, phone, latitude, longitude, default_time_spent)
    VALUES(v_name, autoInc(v_id), v_category, v_max_cap, v_current_cap, v_queue_head,v_business_hours, v_email, a_street, a_city, a_state, a_zip, a_phone, a_lattitude, a_longitude, v_default_time_spent);
END$$

DELIMITER ;

DELIMITER $$

-- to create a ticket every time a customer joins a line for a particular venue
CREATE PROCEDURE AddTicket(
	t_user_id int, 
    t_uid int, 
    t_token_number int,
    t_created_at time,
    t_entry_time time,
    t_exit_time time
)
BEGIN    
	declare new_queue_head int default 0;
    START TRANSACTION;
    -- Insert ticket data
		-- created_at = current date and time using mysql now() function
		-- exit_time = prediction of the exit_time of a particular customer based on the average_time + entry_time a customer spent for a particular venue
        -- new_queue_head = latest token allocated to a person + 1
        set new_queue_head = (select queue_head from venue where venue_uid = t_uid) +1;
        -- update the queue_head of the current venue to the new token number
        update venue set queue_head = new_queue_head where venue_uid = t_uid;
		insert into ticket(user_id, venue_uid, token_number, created_at, entry_time, exit_time)
        values (t_user_id, t_uid, new_queue_head, now(), t_entry_time, addtime(entry_time, (select default_time_spent from venue where venue_uid = t_uid)));
	COMMIT;
     
END$$

delimiter $$
CREATE DEFINER=`admin`@`%` PROCEDURE `is_store_open`(
	 In uid int,
     out result boolean
     )
Begin
     declare today varchar(10);
     declare open_time json;
     declare close_time json;
	 set today = (dayname(curdate()));
    
	if today = 'Monday' then
			set open_time = (select JSON_EXTRACT(business_hours, '$.M[0]') from venue where venue_uid= uid);
			set close_time = (select JSON_EXTRACT(business_hours, '$.M[1]') from venue where venue_uid= uid);
	elseif today = 'Tuesday' then 
			set open_time = (select JSON_EXTRACT(business_hours, '$.T[0]') from venue where venue_uid= uid);
			set close_time = (select JSON_EXTRACT(business_hours, '$.T[1]') from venue where venue_uid= uid);
	elseif today = 'Wednesday' then 
			set open_time = (select JSON_EXTRACT(business_hours, '$.W[0]') from venue where venue_uid= uid);
			set close_time = (select JSON_EXTRACT(business_hours, '$.W[1]') from venue where venue_uid= uid);
	elseif today = 'THursday' then 
			set open_time = (select JSON_EXTRACT(business_hours, '$.Th[0]') from venue where venue_uid= uid);
			set close_time = (select JSON_EXTRACT(business_hours, '$.Th[1]') from venue where venue_uid= uid);
	elseif today = 'Friday' then 
			set open_time = (select JSON_EXTRACT(business_hours, '$.F[0]') from venue where venue_uid= uid);
			set close_time = (select JSON_EXTRACT(business_hours, '$.F[1]') from venue where venue_uid= uid);
	elseif today = 'Saturday' then 
			set open_time = (select JSON_EXTRACT(business_hours, '$.S[0]') from venue where venue_uid= uid);
			set close_time = (select JSON_EXTRACT(business_hours, '$.S[1]') from venue where venue_uid= uid);
	elseif today = 'Sunday' then 
			set open_time = (select JSON_EXTRACT(business_hours, '$.Su[0]') from venue where venue_uid= uid);
			set close_time = (select JSON_EXTRACT(business_hours, '$.Su[1]') from venue where venue_uid= uid);
     end if;
	 -- unquoting and converitn json object into time using convert() method and then comparing it to current_time
     if curtime() >= convert(JSON_UNQUOTE(open_time), time) and curtime() <= convert(JSON_UNQUOTE(close_time), time) then
		set result = (true);
	 else 
		set result = (false);
	end if;
    
  select @result;
end

delimiter $$
CREATE DEFINER=`admin`@`%` PROCEDURE `store_close_max_cap`(
	In t_uid int, 
    In opening_time time,
    In token_number int,
    In commute_time time
)
BEGIN
        declare avg_leaving_time_prev_day time;
        declare avg_time_spent_prev_day time;
        declare def_waiting_time time;
        declare earliest_entry time;
		declare day_diff_prev_working_day int;
        declare predicted_entry_time time;

   -- @TODO compare the date and get data from prev day for the average leaving time
		set day_diff_prev_working_day = (select datediff(curdate(), (select (ticket_created_at) from ticket where venue_uid = t_uid and date(ticket_created_at) < curdate() order by date(ticket_created_at) desc limit 1 )));
		set avg_time_spent_prev_day = (select SEC_TO_TIME(AVG(TIME_TO_SEC(duration))) from ticket where venue_uid = t_uid and date(ticket_created_at)= date_sub(curdate(), interval day_diff_prev_working_day day));
		set avg_leaving_time_prev_day = (select SEC_TO_TIME(AVG(TIME_TO_SEC(leaving))) from ticket where venue_uid = t_uid and date(ticket_created_at)= date_sub(curdate(), interval day_diff_prev_working_day day));
        set def_waiting_time = (select default_time_spent from venue where venue_uid = t_uid);
        
    -- If the store is not opem yet then we know that queue is not in the full swing
		update venue set current_token= new_token_number where venue_uid = t_uid;
		update venue set queue_cap = queue_cap_venue + 1 where venue_uid = t_uid;
		-- if you're the head of the queue or first person in the queue
        
		if (select queue_cap from venue where venue_uid = t_uid) = 1 then
        
            set earliest_entry = (select min(entry_time) from ticket where venue_uid = t_uid and date(ticket_created_at) = curdate());
			update venue set queue_head = token_number where venue_uid = t_uid;
            
            -- if person is at the store
			if ( commute_time is null) then
				insert into ticket(user_id, venue_uid, token_number, ticket_created_at, approx_entry, entry_time, exit_time)
				values (t_user_id, t_uid, new_token_number, now()
				-- approx_entr_time = opening_time + def_time - ( curtime() - earliest_entry)
				,addtime( opening_time, subtime(def_waiting_time, subtime( curtime() , earliest_entry)) ),
				approx_entry, null);
            else
                set predicted_entry_time = addtime( opening_time, subtime(def_waiting_time, subtime( curtime() , earliest_entry)) );
				insert into ticket(user_id, venue_uid, token_number, ticket_created_at, approx_entry, entry_time, exit_time)
				values (t_user_id, t_uid, new_token_number, now()
				-- approx_entr_time = max ((curtime() + commute_time), opening_time + def_time - ( curtime() - earliest_entry) )
				,( select greatest ( predicted_entry_time, addtime(curtime(), commute_time))),
				approx_entry, null);
            end if;
            
		else
        
        -- entry time for rest of the customers in the queue
			update venue set queue_head = token_number where venue_uid = t_uid;
            
			select SEC_TO_TIME(AVG(TIME_TO_SEC(duration))) as queue_wait_in_if_null from ticket where venue_uid = t_uid;
            
            -- if person is at the store
			if ( commute_time is null) then
				insert into ticket(user_id, venue_uid, token_number, ticket_created_at, approx_entry, entry_time, exit_time)
				values (t_user_id, t_uid, new_token_number, now()
				-- approx_entr_time = open_time + (avg(duration_prev_day)) + #of people ahead in the queue * avg(leaving_time_prev_day)
				,addtime(addtime(opening_time, avg_time_spent_prev_day) ,(select queue_cap from venue where venue_uid = t_uid) * avg_leaving_time_prev_day),
				approx_entry, null);
            else 
            -- if person is not at the store
				set predicted_entry_time = addtime(addtime(opening_time, avg_time_spent_prev_day) ,(select queue_cap from venue where venue_uid = t_uid) * avg_leaving_time_prev_day);
				insert into ticket(user_id, venue_uid, token_number, ticket_created_at, approx_entry, entry_time, exit_time)
				values (t_user_id, t_uid, new_token_number, now()
				-- approx_entr_time = open_time + (avg(duration_prev_day)) + #of people ahead in the queue * avg(leaving_time_prev_day)
				,( select greatest ( predicted_entry_time, addtime(curtime(), commute_time))),
				approx_entry, null);
            end if;
		end if;
END

delimiter $$
CREATE DEFINER=`admin`@`%` PROCEDURE `store_open_max_cap`(
	In t_uid int,
    In user_id int,
    In token_number int,
    In commute_time time

)
BEGIN

		declare avg_time_spent time;
        declare avg_leaving_time time;
        declare avg_time_spent_prev_day time;
		declare avg_leaving_time_prev_day time;
        declare earliest_entry time;
        declare queue_cap_venue time;
        declare def_waiting_time time;
		declare day_diff_prev_working_day int;
        declare predicted_entry_time time;
   -- average_time_spent = if the duration column is null, take data for the duration from prev day
		set avg_time_spent = (select SEC_TO_TIME(AVG(TIME_TO_SEC(duration))) from ticket where venue_uid = t_uid and date(ticket_created_at) = utc_date());
        
   -- avg_leaving_time = if the leaving column is null, take data for the leaving from prev da
        set avg_leaving_time = (select SEC_TO_TIME(AVG(TIME_TO_SEC(leaving))) from ticket where venue_uid = t_uid and date(ticket_created_at) = utc_date());
        
        set queue_cap_venue = (select queue_cap from venue where venue_uid = t_uid);
        set def_waiting_time = (select default_time_spent from venue where venue_uid = t_uid);
		update venue set current_token= token_number where venue_uid = t_uid;
		update venue set queue_cap = queue_cap_venue + 1 where venue_uid = t_uid;
        
		-- if you're the head of the queue or first person in the queue and there's no data from the current day
		if (select queue_cap from venue where venue_uid = t_uid) = 1 and (avg_leaving_time is null) then
			set earliest_entry = (select min(entry_time) from ticket where venue_uid = t_uid and date(ticket_created_At) = utc_date());
            select earliest_entry as earliest_entry;
        
			update venue set queue_head = token_number where venue_uid = t_uid;
            select queue_head as queue_head from venue where venue_uid = t_uid;
            
            -- if person is at the store
            if ( commute_time is null) then
				-- approx_entr_time = utc_time() + (def_time - ( utc_time() - earliest_entry))
				insert into ticket(user_id, venue_uid, token_number, ticket_created_at, approx_entry, entry_time, exit_time)
				values (user_id, t_uid, token_number, utc_timestamp
				,addtime(utc_time(), subtime(def_waiting_time, subtime( utc_time() , earliest_entry)) ),
				approx_entry, null);
			else
			-- if person not at the store
			-- approx_entr_time = max [ (utc_time() + commute_time) + (def_time - ( utc_time() - earliest_entry))
				set predicted_entry_time = addtime(utc_time(), subtime(def_waiting_time, subtime( utc_time() , earliest_entry)) );
				insert into ticket(user_id, venue_uid, token_number, ticket_created_at, approx_entry, entry_time, exit_time)
				values (user_id, t_uid, token_number, utc_timestamp
				,(select greatest(predicted_entry_time, (addtime(utc_time(), commute_time)) )),
				approx_entry, null);
            end if;
            
		-- if you're the head of the queue or first person in the queue and there's data present from the current day
		elseif (select queue_cap from venue where venue_uid = t_uid) = 1 and (avg_leaving_time is not null) then
			set earliest_entry = (select min(entry_time) from ticket where venue_uid = t_uid and date(ticket_created_at) = utc_date());
			update venue set queue_head = token_number where venue_uid = t_uid;
            
            -- if person is at the store
			if ( commute_time is null) then
				insert into ticket(user_id, venue_uid, token_number, ticket_created_at, approx_entry, entry_time, exit_time)
				values (user_id, t_uid, token_number, utc_timestamp
				-- approx_entr_time = avg_leaving_time
				,addtime(utc_time(), avg_leaving_time ),
				approx_entry, null);
            else 
				set predicted_entry_time = addtime(utc_time(), avg_leaving_time );
				insert into ticket(user_id, venue_uid, token_number, ticket_created_at, approx_entry, entry_time, exit_time)
				values (user_id, t_uid, token_number, utc_timestamp
				-- approx_entr_time = max(curtime + commute_time, utc_time() + avg_leaving_time
				,(select greatest(predicted_entry_time, (addtime(utc_time(), commute_time)) )),
				approx_entry, null);
            end if;
		-- entry time for rest of the customers in the queue when the data is enough
		elseif (avg_leaving_time is not null) then
        
			update venue set queue_head = token_number where venue_uid = t_uid;
            
			select SEC_TO_TIME(AVG(TIME_TO_SEC(duration))) as queue_wait_in_if_null from ticket where venue_uid = t_uid;
            
            -- if person is at the store
			if ( commute_time is null) then
				select utc_timestamp as in_if;
                select utc_time() as utctime_in_if;
                select addtime(utc_time(), avg_time_spent) as time_plus_avg_time;
                
                -- select (SEC_TO_TIME( TIME_TO_SEC(avg_leaving_time) * (select queue_cap from venue where venue_uid = t_uid)-1) )   as num_pp_mul_lvg_time;
				select avg_time_spent as avg_time_spent_in_if;
				select avg_leaving_time as avg_leaving_time_in_if;
				select addtime( addtime(utc_time(), avg_time_spent) ,(select queue_cap from venue where venue_uid = t_uid)-1 * avg_leaving_time) as computation;
                
				insert into ticket(user_id, venue_uid, token_number, ticket_created_at, approx_entry, entry_time, exit_time)
				values (user_id, t_uid, token_number, utc_timestamp
				-- approx_entr_time = current_time + (avg(duration)) + #of people ahead in the queue * avg(leaving_time)
				,addtime(addtime(utc_time(), avg_time_spent) ,(SEC_TO_TIME( TIME_TO_SEC(avg_leaving_time) * (select queue_cap from venue where venue_uid = t_uid)-1) ) ),
				approx_entry, null);
            else
				set predicted_entry_time = addtime(addtime(utc_time(), avg_time_spent) ,(SEC_TO_TIME( TIME_TO_SEC(avg_leaving_time) * (select queue_cap from venue where venue_uid = t_uid)-1) ) );
				insert into ticket(user_id, venue_uid, token_number, ticket_created_at, approx_entry, entry_time, exit_time)
				values (user_id, t_uid, token_number, utc_timestamp
				-- approx_entr_time = max ( utc_time() + commute_time, current_time + (avg(duration)) + #of people ahead in the queue * avg(leaving_time) )
				,(select greatest(predicted_entry_time, (addtime(utc_time(), commute_time)) )),
				approx_entry, null);
            end if;
            -- when there's no data and this person is not the head of the queue
		elseif (avg_leaving_time is null) then
        -- get how many days before the store was open or example a store was last opened on saturday and today's Monday. so day_diff = 1
			set day_diff_prev_working_day = (select datediff(utc_date(), (select (ticket_created_at) from ticket where venue_uid = t_uid and date(ticket_created_at) < utc_date() order by date(ticket_created_at) desc limit 1 )));
        -- entry time for rest of the customers in the queue when the data is enough
			update venue set queue_head = token_number where venue_uid = t_uid;
            -- avg time from prev day
            set avg_time_spent_prev_day = (select SEC_TO_TIME(AVG(TIME_TO_SEC(duration))) from ticket where venue_uid = t_uid and date(ticket_created_at)= date_sub(utc_date(), interval day_diff_prev_working_day day));
            -- avg leaving from prev day
			set avg_leaving_time_prev_day = (select SEC_TO_TIME(AVG(TIME_TO_SEC(leaving))) from ticket where venue_uid = t_uid and date(ticket_created_at)= date_sub(utc_date(), interval day_diff_prev_working_day day));
            
            -- if person is at the store
			if ( commute_time is null) then
				insert into ticket(user_id, venue_uid, token_number, ticket_created_at, approx_entry, entry_time, exit_time)
				values (user_id, t_uid, token_number, utc_timestamp
				-- approx_entr_time = current_time + (avg(duration)) + #of people ahead in the queue * avg(leaving_time_prev_day)
				,addtime(addtime(utc_time(), ( select if ( avg_time_spent_prev_day is null , time('00:03:00'),avg_time_spent_prev_day ) ) ) ,(SEC_TO_TIME( TIME_TO_SEC( ( select if ( avg_leaving_time_prev_day is null , time('00:02:00'),avg_leaving_time_prev_day ) ) ) * (select queue_cap from venue where venue_uid = t_uid)-1) ) ),
				approx_entry, null);
            else
				set predicted_entry_time = addtime(addtime(utc_time(), ( select if ( avg_time_spent_prev_day is null , time('00:03:00'),avg_time_spent_prev_day ) ) ) ,(SEC_TO_TIME( TIME_TO_SEC( ( select if ( avg_leaving_time_prev_day is null , time('00:02:00'),avg_leaving_time_prev_day ) ) ) * (select queue_cap from venue where venue_uid = t_uid)-1) ) );
				insert into ticket(user_id, venue_uid, token_number, ticket_created_at, approx_entry, entry_time, exit_time)
				values (user_id, t_uid, token_number, utc_timestamp
				-- approx_entr_time = max ( (curtime + commute_time),  current_time + (avg(duration)) + #of people ahead in the queue * avg(leaving_time_prev_day) )
				,(select greatest(predicted_entry_time, (addtime(utc_time(), commute_time)) )),
				approx_entry, null);
            end if;
		end if;
END