import datetime


def handler(event, context):
    # save event to logs
    print(event)

    return {
        'statusCode': 200,
        'executedAt': str(datetime.datetime.now()),
        'body': event,
    }
