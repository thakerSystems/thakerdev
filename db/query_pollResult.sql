SELECT 
    poll.poll_name AS pollName,
    (SELECT 
            name
        FROM
            category
        WHERE
            id = (SELECT 
                    category_id
                FROM
                    category_poll_map
                WHERE
                    poll_id = poll.id)) AS category,
    poll.created_user_id AS createdUserId,
    question.question AS question,
    question_options.`option` AS choices,
    COUNT(answer.question_options_id) AS resultCount
FROM
    poll
        INNER JOIN
    question ON question.poll_id = poll.id
        INNER JOIN
    question_options ON question_options.question_id = question.id
        RIGHT JOIN
    answer ON (answer.question_id = question.id)
        AND (answer.question_options_id = question_options.id)
WHERE
    poll.id = '4'
GROUP BY answer.question_options_id;