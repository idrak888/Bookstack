import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const BookHolder = props => {
    const LeftActions = () => {
        return (
            <TouchableOpacity onPress={() => removeBook()} style={{backgroundColor: '#E74C3C', padding: 20, justifyContent: 'center'}} activeOpacity={0.8}>
                <Image style={{width: 25, height: 25}} source={{uri:'https://www.pinclipart.com/picdir/big/88-882904_mermaiden-crystal-dress-up-game-white-x-icon.png'}}/>
            </TouchableOpacity>
        )
    }
    const removeBook = () => {
        props.removeBook();
    }
    return (
        <Swipeable
            renderRightActions={LeftActions}
        >
            <TouchableOpacity activeOpacity={0.8}>
                <View style={styles.bookHolder}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'column'}}>
                            <Image resizeMode="cover" style={{width: 120, height: 180}} source={{uri:props.thumbnail}}/>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Image style={{width: 16, height: 16}} source={{uri: 'https://www.shareicon.net/data/2016/09/23/833823_list_512x512.png'}}/>
                                <Text style={{fontSize: 12, fontWeight: 'bold', color: '#FF7C44', marginLeft: 5}}>{props.pageCount ? props.pageCount : 100}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'column', padding: 10, flexShrink: 1}}>
                            <Text style={{fontSize: 20}}>{props.title}</Text>
                            <Text style={{fontSize: 18, color: 'grey'}}>{props.subtitle ? props.subtitle : ''}</Text>
                            {props.authors ? props.authors.map(author => <Text style={{fontSize: 15, color: '#FF7C44'}}>{author}</Text>) : <Text style={{fontSize: 18, color: 'grey'}}>No authors</Text>}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    bookHolder: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
        borderBottomColor: '#EAECEE',
        borderBottomWidth: 1
    }
});

export default BookHolder;