import { Match, Template } from "aws-cdk-lib/assertions";
import {
	beforeAll, describe, it
} from '@jest/globals'
import * as cdk from "aws-cdk-lib";
import { LambdaCloudwatchDashboardStack } from "../lib/lambda-cloudwatch-dashboard-stack";

describe("LambdaCloudwatchDashboardStack", () => {
	const app = new cdk.App();
	let lambdaStack: LambdaCloudwatchDashboardStack

	beforeAll(() => {
		// when
		lambdaStack = new LambdaCloudwatchDashboardStack(app, 'LambdaTest', {
			dashboardName: 'DashboardTestName'
		})
	})

	it.each([
		{
			message: 'have a lambda function',
			skip: false,
			getData: () => ({
				type: 'AWS::Lambda::Function',
				property: {
					"Code": Match.anyValue(), // TODO: ensure this code is built from llambda-handler.py
					"Handler": "lambda-handler.handler",
					"MemorySize": 512,
					"Role": Match.anyValue(),
					"Runtime": "python3.12",
					"Timeout": 10
				}
			})
		}, {
			message: 'have a CloudWatch dashboard',
			skip: false,
			getData: () => ({
				type: 'AWS::CloudWatch::Dashboard',
				property: {
					DashboardName: 'DashboardTestName',
					DashboardBody: Match.anyValue(), // TODO: check dashboard body
				}
			})
		}
	])('should $message', ({ skip, message, getData }) => {
		//given
		const template = Template.fromStack(lambdaStack)
		const data = getData()
		//then
		if (skip) {
			console.log('SKIPPING: ', message)
			return
		}
		template.hasResourceProperties(data.type, data.property)
	})
})