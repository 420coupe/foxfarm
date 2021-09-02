import { Text, Center, HStack } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { CardContent } from '../../Atoms/CardContent'
import { CardContainer } from '../../Atoms/CardContainer'
import { FoxEthStakingIconGroup } from 'Molecules/LiquidityIconGroup'
import { StakingHeader } from './StakingHeader'
import { useStaking } from 'state/StakingProvider'
import { bnOrZero, formatBaseAmount } from 'utils/math'
import { useMemo } from 'react'
import { RouteProps } from 'react-router-dom'
import { useFarming } from 'hooks/useFarming'
import { RewardAmounts } from './RewardAmounts'

type RewardsType = RouteProps & { location?: { state?: { staked?: boolean } } }

export const Rewards = ({ location }: RewardsType) => {
  const {
    userStakedBalance,
    userUnclaimedRewards,
    userFoxHoldingsStakedAndLp,
    userEthHoldingsStakedAndLp,
    totalUsdcValueStakedAndLp,
    userLpBalance
  } = useStaking()
  const { totalApr } = useFarming()

  const foxAmount = useMemo(() => {
    return formatBaseAmount(bnOrZero(userUnclaimedRewards?.toString()), 18)
  }, [userUnclaimedRewards])

  const stakedLpBalance = useMemo(() => {
    return formatBaseAmount(bnOrZero(userStakedBalance?.toString()), 18)
  }, [userStakedBalance])

  const userHoldingsValue = useMemo(() => {
    return formatBaseAmount(bnOrZero(totalUsdcValueStakedAndLp), 18)
  }, [totalUsdcValueStakedAndLp])

  const unstakedLpBalance = useMemo(() => {
    return formatBaseAmount(userLpBalance ? userLpBalance.toString() : '0', 18)
  }, [userLpBalance])

  return (
    <CardContainer>
      <StakingHeader
        totalUsdcValue={userHoldingsValue}
        userEthHoldings={userEthHoldingsStakedAndLp}
        userFoxHoldings={userFoxHoldingsStakedAndLp}
        stakedBalance={stakedLpBalance}
        unstakedBalance={unstakedLpBalance}
        showStaking
      />
      <CardContent px={8}>
        {bnOrZero(stakedLpBalance?.toString()).gt(0) && location?.state?.staked && (
          <Center
            bgColor='green.800'
            border='1px'
            borderColor='green.500'
            borderRadius='md'
            color='green.500'
            w='full'
            p={4}
          >
            <HStack spacing={4} w='full'>
              <CheckCircleIcon />
              <Text fontWeight='bold'>
                You have successfully staked {stakedLpBalance} LP Tokens!
              </Text>
            </HStack>
          </Center>
        )}
        <Text>Current APR</Text>
        <Text
          mb={0}
          fontSize='2xl'
          textAlign='center'
          fontWeight='bold'
          bg='blue.100'
          my={2}
          color='blue.500'
          borderRadius='lg'
          px={4}
        >
          {totalApr}% APR*
        </Text>
        <FoxEthStakingIconGroup w='170px' my={8} />

        <Center flexDir='column' width='100%'>
          <RewardAmounts foxAmount={foxAmount} />
        </Center>
      </CardContent>
    </CardContainer>
  )
}