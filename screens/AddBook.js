import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image, AsyncStorage, Alert } from 'react-native';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
import { connect } from 'react-redux';

class AddBook extends Component {
    state = {
        apiKey: '',
        searchKeys: '',
        books: [],
        collection: []
    }
    typingTimer;   
    componentDidMount() {
        this.fetchCollection();
        this.displayData();

        const randomizer = Math.floor(Math.random() * Math.floor(3));
        var term = '';

        switch(randomizer) {
            case 0:
                term = 'harry+potter';
                break;
            case 1: 
                term = 'how+to';
                break;
            case 2: 
                term = 'the';
                break;
            default :
                term = 'the';
        }

        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${term}&orderBy=relevance&key=${this.state.apiKey}`)
        .then(doc => {
            this.setState({books:doc.data.items});
        });

    }
    updateSearch = keys => {
        this.setState({searchKeys:keys, books:[]});
        var keys = keys.replace(' ', '+');
        clearTimeout(this.typingTimer);
        this.typingTimer = setTimeout(() => {
            axios.get(`https://www.googleapis.com/books/v1/volumes?q=${keys}&key=${this.state.apiKey}`)
            .then(doc => {
                this.setState({books:doc.data.items});
            });
        }, 2000);
    }
    addToCollection = book => {
        var collection = this.state.collection;
        collection.unshift(book.volumeInfo);
        this.updateCollection(collection);
    }
    fetchCollection = async () => {
        try {
            let collection = await AsyncStorage.getItem('collection');
            if (collection == null) {
                
            } else {
                collection = JSON.parse(collection);
                this.setState({collection});
            }   
        } catch (e) {
            console.log(e);
        }
    }
    displayData = async () => {
        try {
            let user = await AsyncStorage.getItem('user');
            if (user !== 'johndoe') {
                Alert.alert(
                    'Alert',
                    'Tap and hold on a book to add it to your collection!',
                    [
                        {
                            text: 'Ok',
                            onPress: this.saveUser()
                        }
                    ]
                );
                Alert.alert(
                    'Note',
                    'You can slide left on a book to remove it from your collection.',
                    [
                        {
                            text: 'Ok',
                            onPress: this.saveUser()
                        }
                    ]
                );
            }
        } catch (e) {
            console.log(e);
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <SearchBar 
                    placeholder="Search books"
                    onChangeText={this.updateSearch}
                    value={this.state.searchKeys}
                />
                <Image 
                    source={{uri: 'https://gifimage.net/wp-content/uploads/2017/09/ajax-loading-gif-transparent-background-8.gif'}}
                    style={this.state.books.length > 1 ? {display: 'none'} : styles.loader}
                />
                <FlatList
                    data={this.state.books}
                    style={this.state.books.length > 0 ? {flex: 1} : {display: 'none'}}
                    renderItem={book => {
                        return (
                            <TouchableOpacity onLongPress={() => this.addToCollection(book.item)} key={book.item.id} style={styles.bookHolder}>
                                <View style={{flexDirection: 'row'}}>
                                    <Image resizeMode="cover" style={{width: 120, height: 180}} source={{uri:book.item.volumeInfo.imageLinks ? book.item.volumeInfo.imageLinks.thumbnail : ''}}/>
                                    <View style={{flexDirection: 'column', padding: 10, flexShrink: 1}}>
                                        <Text style={{fontSize: 20}}>{book.item.volumeInfo.title}</Text>
                                        <Text style={{fontSize: 18, color: 'grey'}}>{book.item.volumeInfo.subtitle ? book.item.volumeInfo.subtitle : ''}</Text>
                                        {book.item.volumeInfo.authors ? book.item.volumeInfo.authors.map(author => <Text style={{fontSize: 15, color: '#FF7C44'}}>{author}</Text>) : <Text style={{fontSize: 18, color: 'grey'}}>No authors</Text>}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        );
    }
    saveUser() {
        AsyncStorage.setItem('user', 'johndoe');
    }
    updateCollection(updatedCollection) {
        AsyncStorage.setItem('collection', JSON.stringify(updatedCollection));
        alert('Added to collection!');
        this.props.updateCollection(updatedCollection);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    bookHolder: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
        borderBottomColor: '#EAECEE',
        borderBottomWidth: 1
    },
    loader: {
        width: 40,
        height: 40,
        alignSelf: 'center',
        marginTop: 200
    }
});

function mapStateToProps(state) {
    return { collection: state.collection }
}

const mapDispatchToProps = dispatch => {
    return {
      // dispatching plain actions
      updateCollection: updatedCollection => dispatch({ type: 'UPDATE_COLLECTION', updatedCollection })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddBook);
